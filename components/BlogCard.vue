<script setup>
import { ref, onMounted } from 'vue';
import { tagColor } from "~/assets/utils/tags.ts";
import { usePreferenceStore } from "~/stores/Preferences.ts";

const preference = usePreferenceStore();

const props = defineProps({
  heading: String,
  id: String,
  image: String,
  imageAltText: String,
  text: String,
  likes: Number,
  publishedDate: String,
  userId: String,
  tags: Array
});

let user = ref(null);
let blogLikes = ref(props.likes);
let isBlogLikedByUser = ref(preference.likedBlogs.includes(props.id));

function fetchUser() {
  if (!props.userId) return;
  fetch(`/api/user/${props.userId}`)
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
}

onMounted(fetchUser);

async function updateLikes(blogId, event) {
  try {
    const response = await fetch(`/api/blog/like/${blogId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: event.target.checked ? 'increment' : 'decrement' })
    });
    if (!response.ok) throw new Error('Failed to update likes');
    isBlogLikedByUser.value = event.target.checked;
    preference.likeBlog(props.id);
    blogLikes.value = event.target.checked ? blogLikes.value + 1 : blogLikes.value - 1;
  } catch (error) {
    console.error('Error updating likes:', error);
  }
}
</script>

<template>
  <article>
    <nuxt-link class="blog-card" :to="'blogg/' + id">
      <div class="banner">
        <ul v-if="tags" :style="image ? 'position: absolute;' : ''">
          <li 
            v-for="(tag, index) in tags" 
            :style="'background-color: ' + tagColor(tag) + ';'"
            :key="index"
          >
            {{ tag }}
          </li>
        </ul>
        <img v-if="image" height="150" :src="image.replace('jpeg', 'WebP')" :alt="imageAltText">
      </div>
      <h2 v-if="heading">{{ heading }}</h2>
      <p v-if="text" class="text" v-html="text" />
      <div class="blog-card-footer">
        <time v-if="publishedDate" :datetime="publishedDate" :aria-label="'Publisert ' + publishedDate">
          {{ publishedDate }}
        </time>
        <span v-if="user?.name" :aria-label="publishedDate ? 'Av ' + user.name : 'Skrevet av ' + user.name">
          {{ user.name }}
        </span>
      </div>
      <span class="sr-only">Les mer om {{ heading }}</span>
    </nuxt-link>
    <fieldset>
      <legend class="sr-only">like:</legend>
      <label class="like-section" :for="'like-'+id">
        <Heart class="heart" :fill="isBlogLikedByUser" />
        <input class="sr-only" type="checkbox" name="like" :id="'like-'+id" :checked="isBlogLikedByUser" @input="event => updateLikes(id, event)">
        {{ blogLikes }}
      </label>
    </fieldset>
  </article>
</template>

<style scoped lang="scss">
.blog-card {
  display: flex;
  flex-flow: column;
  padding: 8px 0 10px;
  border: 2px solid $background-color;
  border-radius: 5px;
  width: 100%;
  max-width: 600px;
  height: calc(100% - 18px - 33px);
  text-decoration: none;
  color: black;
  filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));
  .banner {
    width: 100%;
    position: relative;
    height: 157px;
    ul {
      display: flex;
      flex-flow: column;
      list-style-type: none;
      margin: 0;
      padding: 12px 0;
      z-index: 2;
      translate: -2px 0;
      gap: 6px;
      li {
        font-size: 12px;
        padding: 4px 4px 4px 6px;
        width: fit-content;
        border-radius: 1px 5px 5px 1px;
        filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.2));
      }
    }
    .image-placeholder {
      height: 150px;
    }
    img {
      object-fit: cover;
      height: 150px;
      width: calc(100% - 10px);
      margin: 1px 0 1px 10px;
      translate: 2px 0;
      border-radius: 5px 1px 1px 5px;
      filter: drop-shadow(-2px 4px 4px rgba(0, 0, 0, 0.25));
    }
  }
  h2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0 10px;
    font-weight: 600;
    font-size: 18px;
  }
  .text {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0 10px;
  }
  .blog-card-footer {
    display: flex;
    padding-top: 10px;
    margin: auto 10px 0;
    flex-flow: row-reverse;
    justify-content: space-between;
    span {
      margin-right: 12px;
      font-style: italic;
      order: 2;
    }
    time {
      order: 1;
    }
  }
  &:hover {
    background-color: $background-color;
    .banner {
      ul {
        li {
          filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.4));
        }
      }
      img {
        object-fit: cover;
        height: 152px;
        width: calc(100% - 8px);
        margin: 0px 0 0px 8px;
        translate: 2px 0;
        border-radius: 5px 1px 1px 5px;
        filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.4));
      }
    }
  }
}
fieldset {
  border: none;
  appearance: none;
  padding: 0;
  .like-section {
    display: flex;
    width: fit-content;
    align-items: center;
    gap: 4px;
    text-align: center;
    margin-top: 8px;
    margin-left: auto;
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
</style>