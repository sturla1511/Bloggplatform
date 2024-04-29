<script setup>
import { ref, onMounted, watch } from 'vue';
import { tagColor } from "~/assets/utils/tags.ts";
import { usePreferenceStore } from "~/stores/Preferences.ts";

const preference = usePreferenceStore();

const route = useRoute()

let blog = ref({});
let user = ref(null);
async function fetchItem() {
  try {
    const response = await fetch(`/api/blog/${route.params.id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch item');
    }
    blog.value = await response.json();
    if (!blog?.value?.userId) return;
    fetch(`/api/user/${blog?.value?.userId}`)
        .then(response => {
          if (!response.ok) throw new Error('Failed to fetch user');
          return response.json();
        })
        .then(userData => {
          user.value = userData;
        })
        .catch(error => {
          console.error('Error fetching user:', error);
        });
  } catch (error) {
    console.error('Error fetching item:', error);
    blog.value = null;
  }
}

onMounted(fetchItem);

let isBlogLikedByUser = ref(preference.likedBlogs.includes(blog?.value?.id));

watch(blog, (newVal, oldVal) => {
  useHead({
    meta: [
      { name: 'title', content: `${newVal?.heading}` },
      { name: 'description', content: `${newVal?.heading}` }
    ]
  });
});

async function updateLikes(blogId, event) {
  try {
    const response = await fetch(`/api/blog/like/${blogId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: event.target.checked ? 'increment' : 'decrement' })
    });
    if (!response.ok) throw new Error('Failed to update likes');
    isBlogLikedByUser.value = event.target.checked;
    preference.likeBlog(blog?.value?.id);
    blog.value.likes = event.target.checked ? blog.value.likes + 1 : blog.value.likes - 1;
  } catch (error) {
    console.error('Error updating likes:', error);
  }
}
</script>

<template>
  <div v-if="blog" class="blog-container">
    <nav>
      <nuxt-link class="go-back" to="/"><Arrow class="arrow" /> gå tilbake</nuxt-link>
    </nav>
    <div class="heading">
      <time v-if="blog?.publishedDate"><span class="sr-only">published </span>{{ blog?.publishedDate }}</time>
      <h1 v-if="blog?.heading">{{ blog.heading }}</h1>
    </div>
    <div class="banner">
      <ul v-if="blog?.tags">
        <li 
          v-for="(tag, index) in blog?.tags"
          :style="'background-color: ' + tagColor(tag) + ';'"
          :key="index"
        > 
          {{ tag }}
        </li>
      </ul>
      <fieldset v-if="blog.likes">
        <legend class="sr-only">like:</legend>
        <label class="like-section" :for="'like-'+blog?.id">
          <Heart class="heart" :fill="isBlogLikedByUser" />
          <input class="sr-only" type="checkbox" name="like" :id="'like-'+blog?.id" :checked="isBlogLikedByUser" @input="event => updateLikes(blog?.id, event)">
          {{ blog.likes }}
        </label>
      </fieldset>
      <img v-if="blog?.image" height="450" :src="blog.image" :alt="blog?.imageAltText">
      <div v-if="user?.name" class="published-by"><span>publisert av: </span>{{ user?.name }}</div>
    </div>
    <div class="text" v-if="blog?.text" v-html="blog.text" />
  </div>
</template>

<style scoped lang="scss">
 .blog-container {
   position: relative;
   nav {
     position: absolute;
     translate: 0 -22px;
     right: 36px;
     .go-back {
       display: flex;
       align-items: center;
       text-align: center;
       color: black;
       text-decoration-line: none;
       gap: 4px;
       .arrow {
         height: 16px;
         width: 16px;
         rotate: -90deg;
       }
       &:hover {
         gap: 6px;
         font-weight: bold;
         .arrow {
           height: 18px;
           width: 18px;
           rotate: -90deg;
         }
       }
     }
   }
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
     flex-flow: wrap;
     width: 100%;
     position: relative;
     ul {
       position: absolute;
       display: flex;
       gap: 8px;
       flex-flow: column;
       list-style-type: none;
       margin: 0;
       padding: 12px 0;
       z-index: 2;
       li {
         font-size: 14px;
         padding: 4px 6px 4px 6px;
         border-radius: 1px 5px 5px 1px;
         filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));
         width: fit-content;
       }
     }
     fieldset {
       border: none;
       appearance: none;
       padding: 0;
       align-self: center;
       order: 1;
       .like-section {
         display: flex;
         width: fit-content;
         flex-flow: row-reverse;
         align-items: center;
         gap: 4px;
         text-align: center;
         margin-top: 8px;
         //margin-left: auto;
         margin-right: 8px;
         cursor: pointer;
         &:focus-within {
           outline: -webkit-focus-ring-color auto 1px;
         }
         .heart {
           height: 21px;
           width: 21px;
           margin: 2px;
         }
         &:hover {
           .heart {
             height: 25px;
             width: 25px;
             margin: 0;
           }
         }
       }
     }
     img {
       display: flex;
       width: 100%;
       filter: drop-shadow(-2px 4px 4px rgba(0, 0, 0, 0.25));
       object-fit: cover;
     }
     .published-by {
       margin-top: 8px;
       margin-left: 8px;
       margin-right: auto;
       align-self: center;
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
       fieldset {
         .like-section {
           margin-right: 16px;
         }
       }
       .published-by {
         margin-left: 16px;
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
       fieldset {
         position: absolute;
         bottom: 20px;
         left: 4px;
         .like-section {
           flex-flow: column;
         }
       }
       .published-by {
         margin-left: auto;
         margin-right: 36px;
       }
     }
     .text {
       margin: 0 36px;
     }
   }
 }
</style>