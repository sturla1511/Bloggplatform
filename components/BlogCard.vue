<script setup>
import { ref } from 'vue';
import { tagColor } from "~/assets/utils/tags.ts";

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

let user = ref('')
if (props.userId) {
  try {
    const response = await fetch(`/api/user/${props.userId}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    user.value = await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}

async function updateLikes(blogId, event) {
  try {
    const response = await fetch(`/api/blog/like/${blogId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: event.target.checked ? 'increment' : 'de crement' })
    });
    if (!response.ok) throw new Error('Failed to update likes');
  } catch (error) {
    console.error('Error updating likes:', error);
  }
}
</script>

<template>
  <nuxt-link class="blog-card" :to="'blogg/' + id">
    <article>
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
        <img v-if="image" :src="image" :alt="imageAltText">
      </div>
      <h3 v-if="heading">{{ heading }}</h3>
      <p v-if="text" class="text" v-html="text" />
      <div class="blog-card-footer">
        <time v-if="publishedDate" :datetime="publishedDate" :aria-label="'Publisert ' + publishedDate">
          {{ publishedDate }}
        </time>
        <span v-if="user?.name" :aria-label="publishedDate ? 'Av ' + user.name : 'Skrevet av ' + user.name">
          {{ user.name }}
        </span>
      </div>
      <!--div class="like-section">
        <input type="checkbox" name="like" id="like-{{ id }}" @input="event => updateLikes(id, event)">
        <label for="like-{{ id }}">{{ likes }} <i class="fas fa-heart"></i></label>
      </div>-->
      <span class="sr-only">Les mer om {{ heading }}</span>
    </article>
  </nuxt-link>
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
  height: calc(100% - 18px);
  text-decoration: none;
  color: black;
  filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));
  article {
    height: 100%;
    display: flex;
    flex-flow: column;
  }
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
  h3 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0 10px;
    font-weight: 600;
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
    span {
      margin-right: auto;
      font-style: italic;
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
</style>