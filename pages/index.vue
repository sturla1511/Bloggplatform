<script setup>
import BlogList from "~/components/BlogList.vue";
const preference = usePreferenceStore();

</script>

<template>
  <div class="front-page">
    <h1>Bloggplatform!</h1>
    <SelectInterests v-if="preference.isUserNew" />
    <BlogList v-if="!preference.isUserNew" />
  </div>
</template>

<style scoped lang="scss">
.front-page {
  width: 100%;
  h1 {
    margin: 36px 36px 0;
  }
}
</style>
