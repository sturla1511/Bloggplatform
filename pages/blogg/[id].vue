<script setup>
import { ref, onMounted } from 'vue';
const route = useRoute()

const blog = ref(null);
async function fetchItem() {
  try {
    const response = await fetch(`/api/blog/${route.params.id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch item');
    }
    blog.value = await response.json();
  } catch (error) {
    console.error('Error fetching item:', error);
    blog.value = null;
  }
}

onMounted(fetchItem);
</script>

<template>
  <div v-if="blog" class="blog-container">
    <div class="heading">
      <time v-if="blog?.publishedDate">{{ blog?.publishedDate }}</time>
      <h1 v-if="blog?.heading">{{ blog.heading }}</h1>
    </div>
    <div class="banner">
      <ul v-if="blog?.tags">
        <li v-for="(tag, index) in blog?.tags" :key="index"> 
          {{ tag }}
        </li>
      </ul>
      <img v-if="blog?.image" :src="blog.image" alt="image">
    </div>
    <div class="text" v-if="blog?.text" v-html="blog.text" />
  </div>
</template>

<style scoped lang="scss">
 .blog-container {
   .heading {
     display: flex;
     flex-flow: column;
     align-items: flex-end;
     gap: 8px;
     margin: 0 10px;
     > * {
       margin-bottom: 8px;
     }
     time {
       font-size: 16px;
       order: 1;
     }
   }
   .banner {
     display: flex;
     width: 100%;
     position: relative;
     ul {
       position: absolute;
       list-style-type: none;
       margin: 0;
       padding: 12px 0;
       z-index: 2;
       li {
         font-size: 14px;
         background-color: #9EEB3C;
         padding: 4px 6px 4px 6px;
         border-radius: 1px 5px 5px 1px;
         filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));
       }
     }
     img {
       display: flex;
       width: 100%;
       filter: drop-shadow(-2px 4px 4px rgba(0, 0, 0, 0.25));
     }
   }
   .text {
     margin: 0 10px;
   }
 }

 @media (min-width: $breakpoint-sm) {
   .blog-container {
     .heading {
       margin: 0 16px;
       flex-flow: wrap;
       > * {
         margin-bottom: 8px;
       }
       time {
         order: 1;
       }
     }
     .banner {
       ul {
         padding: 14px 0;
         translate: -2px 0;
         li {
           padding: 5px 6px;
         }
       }
       img {
         width: calc(100% - 16px);
         border-radius: 8px 2px 2px 8px;
         margin-left: 16px;
         translate: 2px 0;
       }
     }
     .text {
       margin: 0 16px;
     }
   }
 }
 
 @media (min-width: $breakpoint-lg) {
   .blog-container {
     .heading {
       margin: 0 36px;
       flex-flow: row;
       > * {
         margin-bottom: 8px;
       }
       time {
         font-size: 18px;
         order: 0;
       }
     }
     .banner {
       ul {
         padding: 16px 0;
       }
       img {
         width: calc(100% - 31px);
         margin-left: 31px;
         translate: 5px 0;
       }
     }
     .text {
       margin: 0 36px;
     }
   }
 }
</style>