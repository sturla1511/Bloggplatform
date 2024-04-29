<script setup>
const props = defineProps({
  fill: Boolean
});
</script>

<template>
  <svg :class="fill ? 'filled-heart' : 'open-heart'" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
</template>

<style scoped lang="scss">
.open-heart {
  
}
.filled-heart {
  fill: black;
}
</style>