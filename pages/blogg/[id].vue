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
  <div v-if="blog">
    <h1 v-if="blog?.heading">{{ blog.heading }}</h1>
    <img v-if="blog?.image" :src="blog.image" alt="image">
    <div v-if="blog?.text" v-html="blog.text"></div>
  </div>
</template>

<style scoped>

</style>