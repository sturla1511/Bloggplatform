<script setup>
import { ref } from 'vue';
import BlogCard from "~/components/BlogCard.vue";
import { usePreferenceStore } from "~/stores/Preferences.ts";
import { tags, tagColor } from "~/assets/utils/tags.ts";

const preference = usePreferenceStore();

const blogs = ref([]);
let sortBy = ref('relevant')
let selectedTags = ref([])
let tagFilterOpen = ref(false)

async function getBlogs() {
  try {
    const response = await fetch('/api/getBlogs');
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    const allBlogs = await response.json();

    const likedBlogs = allBlogs.filter(blog => preference.likedBlogs.includes(blog.id));
    const likedPublishers = likedBlogs.flatMap(blog => blog.userId);
    const likedTags = likedBlogs.flatMap(blog => blog.tags);

    if (sortBy.value === 'relevant') {
      let blogsWithInterestScore = allBlogs.map(blog => {
        let interestScore = 0;

        likedPublishers.forEach(liked => {
          if (liked === blog.userId) {
            interestScore += 3;
          }
        });
        blog.tags.forEach(tag => {
          preference?.tagPreferences?.forEach(preference => {
            if (preference === tag) {
              interestScore += 9 / blog?.tags?.length;
            }
          });
          likedTags.forEach(liked => {
            if (liked === tag) {
              interestScore += 2;
            }
          });
        });
        return { ...blog, interestScore };
      });
      
      let sortedByInterest = blogsWithInterestScore.sort((a, b) => {
        if (b.interestScore === a.interestScore) {
          return b.likes - a.likes
        } else {
          return b.interestScore - a.interestScore
        }
      });
      
      let sortedByLikes = [...allBlogs].sort((a, b) => b.likes - a.likes);
      
      let interestRankMap = new Map(sortedByInterest.map((blog, index) => [blog.id, index]));
      let likesRankMap = new Map(sortedByLikes.map((blog, index) => [blog.id, index]));
      
      let blogsRanked = allBlogs.map(blog => {
        let interestRank = interestRankMap.get(blog.id);
        let likesRank = likesRankMap.get(blog.id);
        let averageRank = (interestRank + likesRank) / 2;
        return { ...blog, averageRank };
      });
      
      blogs.value  = blogsRanked.sort((a, b) => a.averageRank - b.averageRank);
    } else if (sortBy.value === 'newest') {
      blogs.value = allBlogs.sort((a, b) => {
        const dateA = parseDate(a.publishedDate);
        const dateB = parseDate(b.publishedDate);
        return dateB - dateA;
      });
    } else if (sortBy.value === 'liked') {
      blogs.value = allBlogs.sort((a, b) => {
        return b?.likes - a?.likes;
      });
    }
    if (selectedTags?.value?.length > 0) {
      blogs.value = blogs.value.filter(blog => selectedTags?.value?.every(tag => blog?.tags?.includes(tag)))
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
getBlogs()

async function searchBlogs(query) {
  if (query?.target?.value?.trim().length > 0) {
    try {
      const response = await fetch(`/api/search/${encodeURIComponent(query?.target?.value)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const allBlogs = await response.json();

      blogs.value = allBlogs

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  } else {
    getBlogs()
  }
}

function parseDate(dateString) {
  const [day, month, year] = dateString?.split('.')?.map(part => parseInt(part, 10));
  return new Date(year, month - 1, day);
}

function changeSorting(value) {
  sortBy.value = value.target.value
  getBlogs()
}

function selectTag(selected) {
  if (selectedTags?.value?.includes(selected)) {
    let index = selectedTags?.value?.findIndex((tag) => tag === selected)
    selectedTags?.value?.splice(index, 1);
  } else {
    selectedTags?.value?.push(selected);
  }
  getBlogs()
}

function toggleTagFilter() {
  tagFilterOpen.value = !tagFilterOpen.value;
  getBlogs()
}
</script>

<template>
  <div class="blog-list-container">
    <div class="filters">
      <label class="sr-only" for="search">
        Søk
      </label>
      <input
        class="search"
        type="search"
        id="search"
        name="search"
        @input="searchBlogs"
        placeholder="søk"
      >
      <div class="tag-filter" :class="{'filter-active': tagFilterOpen}">
        <label 
          class="tag-filter-activate" 
          for="filter"
        >
          Filter
          <input
            type="checkbox"
            @input="toggleTagFilter" 
            :checked="tagFilterOpen" 
            name="filter" 
            id="filter" 
            class="filter sr-only" 
          />
          <Arrow class="arrow" :arrow-down="!tagFilterOpen"/>
        </label>
        <ul class="tags" v-if="tagFilterOpen">
          <li v-for="(tag, index) in tags">
            <label
              :style="'background-color: ' + tagColor(tag) + ';'"
              :class="{'tag-selected': selectedTags?.includes(tag)}"
            >
              {{ tag }}
              <input
                  type="checkbox"
                  class="sr-only"
                  :checked="selectedTags?.includes(tag)"
                  @click="selectTag(tag)"
              >
              <CheckboxIcon :checked="selectedTags?.includes(tag)" class="icon"/>
            </label>
          </li>
        </ul>
      </div>
      <fieldset @input="changeSorting">
        <legend class="sr-only">sorter liste:</legend>
        <input class="sr-only" type="radio" id="newest" name="sorter" value="newest" :checked="sortBy === 'newest'" />
        <label class="newest" :class="{'sort-type-selected': sortBy === 'newest'}" for="newest">Nyeste</label>
        <input class="sr-only" type="radio" id="liked" name="sorter" value="liked" :checked="sortBy === 'liked'" />
        <label class="liked" :class="{'sort-type-selected': sortBy === 'liked'}" for="liked">Mest likt</label>
        <input class="sr-only" type="radio" id="relevant" name="sorter" value="relevant" :checked="sortBy === 'relevant'" />
        <label class="relevant" :class="{'sort-type-selected': sortBy === 'relevant'}" for="relevant">For deg</label>
      </fieldset>
    </div>
    <ol v-if="blogs.length" class="blog-list">
      <li v-for="blog in blogs" :key="blog?.id">
        <BlogCard
          :heading="blog?.heading"
          :likes="blog?.likes"
          :id="blog?.id"
          :image="blog?.image"
          :image-alt-text="blog?.imageAltText"
          :text="blog?.text"
          :published-date="blog?.publishedDate"
          :userId="blog?.userId"
          :tags="blog?.tags"
        />
      </li>
    </ol>
    <p v-else-if="!preference.isUserNew">No data found.</p>
  </div>
</template>

<style scoped lang="scss">
.blog-list-container {
  padding: 10px;
  .filters {
    display: flex;
    flex-flow: wrap;
    align-items: center;
    margin-bottom: 10px;
    gap: 16px 20px;
    position: relative;
    z-index: 2;
    .search {
      border: 2px solid $background-color;
      background-color: lighten($background-color, 10%);
      padding: 4px 6px;
      border-radius: 50px;
      margin-top: auto;
      margin-bottom: auto;
      font-size: 16px;
      width: 100%;
    }
    .tag-filter {
      height: 30px;
      max-height: 30px;
      margin-right: auto;
      transition: 0.5s ease all;
      &.filter-active {
        .tag-filter-activate {
          border-radius: 5px 5px 0 0;
          &:hover {
            .arrow {
              rotate: -90deg;
            }
          }
        }
        filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));
      }
      .tag-filter-activate {
        height: 22px;
        max-height: 22px;
        display: flex;
        align-items: center;
        padding: 4px 8px;
        background-color: $background-color;
        border-radius: 15px;
        justify-content: space-between;
        gap: 4px;
        cursor: pointer;
        .arrow {
          width: 16px;
          height: 14px;
          transition: 0.5s ease all;
        }
        &:hover {
          .arrow {
            width: 16px;
            height: 16px;
            rotate: 90deg;
          }
        }
      }
      ul {
        min-width: 200px;
        max-width: 300px;
        display: flex;
        flex-flow: wrap;
        list-style-type: none;
        margin: 0;
        padding: 6px 6px 10px 6px;
        gap: 4px;
        background-color: $background-color;
        border-radius: 0 0 5px 5px;
        justify-content: space-between;
        li {
          display: flex;
        }
        label {
          display: flex;
          padding: 4px 6px;
          border-radius: 5px;
          font-size: 14px;
          height: 16px;
          cursor: pointer;
          align-items: center;
          .icon {
            width: 16px;
            height: 14px;
          }
          &:hover {
            .icon {
              height: 16px;
            }
          }
        }
      }
    }
    fieldset {
      display: flex;
      flex-flow: wrap;
      width: fit-content;
      height: fit-content;
      border: 0;
      padding: 0;
      border-radius: 5px;
      margin: 0;
      row-gap: 6px;
      label {
        height: fit-content;
        padding: 4px 6px;
        border: 2px solid $background-color;
        border-right-width: 0px;
        cursor: pointer;
        &:first-of-type {
          border-radius: 50px 0 0 50px;
        }
        &:last-of-type {
          border-right: 2px solid $background-color;
          border-radius: 0 50px 50px 0;
        }
        &:hover {
          background-color: lighten($background-color, 9%);
        }
        &.sort-type-selected {
          background-color: lighten($background-color, 5%);
        }
      }
    }
  }
  .blog-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
}
@media (min-width: $breakpoint-sm) {
  .blog-list-container {
    .filters {
      .search {
        font-size: 16px;
        width: 200px;
      }
    }
    padding: 16px;
  }
}
@media (min-width: $breakpoint-md) {
  .blog-list-container {
    padding: 0px 36px 36px 36px;
  }
}
</style>