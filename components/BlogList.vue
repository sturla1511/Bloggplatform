<script setup>
import { ref } from 'vue';
import BlogCard from "~/components/BlogCard.vue";
import { tags } from "~/assets/utils/tags.ts";
import { usePreferenceStore } from "~/stores/Preferences.ts";
import { tagColor } from "~/assets/utils/tags.ts";

const preference = usePreferenceStore();

const blogs = ref([]);
let selectedTags = ref(preference.getTags() ?? []);
let sortBy = ref('relevant')

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
    } else if (sortBy.value === 'popular') {
      blogs.value = allBlogs.sort((a, b) => {
        return b?.likes - a?.likes;
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
getBlogs()

function parseDate(dateString) {
  const [day, month, year] = dateString?.split('.')?.map(part => parseInt(part, 10));
  return new Date(year, month - 1, day);
}

function selectTag(selected) {
  preference.addOrRemoveTag(selected);
  preference.getTags(selected);
  getBlogs()
}
</script>

<template>
  <div class="blog-list-container">
    <div v-if="preference.isUserNew()">
      <h1>Velg intereser</h1>
      <ul class="tags">
        <li
            v-for="tag in tags"
            class="tag"
            :key="tag"
        >
          <label :style="'background-color: ' + tagColor(tag) + ';'">
            {{ tag }}
            <input
                type="checkbox"
                :class="selectedTags?.includes(tag) ? 'tag-selected' : ''"
                :checked="selectedTags?.includes(tag)"
                @click="selectTag(tag)"
            >
          </label>
        </li>
      </ul>
      <button class="save-interests" @click="preference.setUser()">Lagre interese</button>
    </div>
    <ul v-if="blogs.length && !preference.isUserNew()" class="blog-list">
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
        {{ blog.interestScore }}
      </li>
    </ul>
    <p v-else-if="!preference.isUserNew()">No data found.</p>
  </div>
</template>

<style scoped lang="scss">
.blog-list-container {
  padding: 10px;
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  .tags {
    display: flex;
    flex-flow: wrap;
    gap: 8px;
    .tag {
      display: flex;
      font-size: 14px;
      height: fit-content;
      label {
        display: flex;
        padding: 4px 6px;
        border-radius: 5px;
        filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.25));
      }
      .tag-selected {
        background-color: gray;
      }
    }
  }
  .save-interests {
    padding: 8px;
    border: none;
    border-radius: 5px;
    margin-top: 12px;
    font-size: 16px;
    background-color: $background-color;
    cursor: pointer;
    filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.25));
    &:hover {
      background-color: darken($background-color, 5%);
    }
    &:active {
      filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.25));
    }
  }
  .blog-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    li {
    
    }
  }
}
@media (min-width: $breakpoint-sm) {
  .blog-list-container {
    padding: 16px;
  }
}
@media (min-width: $breakpoint-md) {
  .blog-list-container {
    padding: 36px;
  }
}
</style>