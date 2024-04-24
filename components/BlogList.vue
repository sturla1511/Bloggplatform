<script setup>
import { ref } from 'vue';
import BlogCard from "~/components/BlogCard.vue";
import { tags } from "~/assets/utils/tags.ts";

const blogs = ref([]);
let selectedTags = ref([]);
let sortBy = ref('newest')

async function getBlogs() {
  try {
    const response = await fetch('/api/getBlogs');
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    const allBlogs = await response.json();
    blogs.value = allBlogs.filter(blog => selectedTags?.value?.every(tag => blog?.tags?.includes(tag)));
    
    const filteredBlogs = allBlogs.filter(blog => selectedTags?.value?.every(tag => blog?.tags?.includes(tag)));
    
    if (sortBy.value === 'newest') {
      blogs.value = filteredBlogs.sort((a, b) => {
        const dateA = parseDate(a.publishedDate);
        const dateB = parseDate(b.publishedDate);
        return dateB - dateA;
      });
    } else if (sortBy.value === 'popular') {
      blogs.value = filteredBlogs.sort((a, b) => {
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
  if (selectedTags?.value?.includes(selected)) {
    const index = selectedTags?.value.findIndex((tag) => selected === tag)
    selectedTags?.value?.splice(index, 1)
  } else {
    selectedTags?.value?.push(selected)
  }
  getBlogs()
}
</script>

<template>
  <div class="blog-list-container">
    <ul class="tags">
      <li 
        v-for="tag in tags"
        class="tag" 
        :key="tag"
      >
        <button
          :class="selectedTags?.includes(tag) ? 'tag-selected' : ''"
          :aria-checked="selectedTags?.includes(tag)" 
          @click="selectTag(tag)"
        >
          {{ tag }}
        </button>
      </li>
    </ul>
    <ul v-if="blogs.length" class="blog-list">
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
    </ul>
    <p v-else>No data found.</p>
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
    .tag {
      font-size: 14px;
      .tag-selected {
        background-color: gray;
      }
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