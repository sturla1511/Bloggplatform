<script setup>
import { ref } from 'vue';

const blogs = ref([]);

try {
  const response = await fetch('/api/getBlogs' );
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  blogs.value = await response.json();
} catch (error) {
  console.error('Error fetching data:', error);
}

async function updateLikes(blogId, event) {
  try {
    const response = await fetch(`/api/blog/like/${blogId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: event.target.checked ? 'increment' : 'decrement' })
    });
    if (!response.ok) throw new Error('Failed to update likes');
    
    let index = blogs?.value?.findIndex(blog => blog.id === blogId)
    if (index === -1) {
      console.error('Blog not found');
      return;
    }
    blogs.value[index] = await response.json();
  } catch (error) {
    console.error('Error updating likes:', error);
  }
}
</script>

<template>
  <div>
    <div v-if="blogs.length">
      <div v-for="blog in blogs" :key="blog.id">
        <h1>{{ blog.heading }}</h1>
        <div>{{ blog.likes }}</div>
        <input type="checkbox" name="like" @input="event => updateLikes(blog.id, event)">
      </div>
    </div>
    <p v-else>No data found.</p>
  </div>
</template>
