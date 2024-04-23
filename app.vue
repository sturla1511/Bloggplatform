<script setup>
import { ref, onMounted } from 'vue';

const items = ref([]);

async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    items.value = await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

onMounted(fetchData);
</script>

<template>
  <div>
    <h1>Data from Cosmos DB</h1>
    <ul v-if="items.length">
      <li v-for="item in items" :key="item.id">{{ item }}</li>
    </ul>
    <p v-else>No data found.</p>
  </div>
</template>
