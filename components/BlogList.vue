<script setup>
import { ref } from 'vue';
import BlogCard from "~/components/BlogCard.vue";
import { usePreferenceStore } from "~/stores/Preferences.ts";

const preference = usePreferenceStore();

const blogs = ref([]);
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
</script>

<template>
  <div class="blog-list-container">
    <input type="search" @input="searchBlogs">
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
    <p v-else-if="!preference.isUserNew">No data found.</p>
  </div>
</template>

<style scoped lang="scss">
.blog-list-container {
  padding: 10px;
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
    padding: 16px;
  }
}
@media (min-width: $breakpoint-md) {
  .blog-list-container {
    padding: 36px;
  }
}
</style>