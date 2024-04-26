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
    margin: 20px 10px 10px;
  }
}
@media (min-width: $breakpoint-sm) {
  .front-page {
    h1 {
      margin: 26px 16px 10px;
    }
  }
}
@media (min-width: $breakpoint-md) {
  .front-page {
    h1 {
      margin: 36px 36px 20px;
    }
  }
}
</style>
