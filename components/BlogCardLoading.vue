<script setup>
const props = defineProps({  
  id: Number
});
</script>

<template>
  <article :aria-hidden="true">
    <div class="blog-card">
      <div class="banner">
        <ul>
          <li>
            Laster...
          </li>
        </ul>
        <div class="image" />
      </div>
      <h2>~~~~~~~~~~~~</h2>
      <p class="text">~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</p>
      <div class="blog-card-footer">
        <time>
          ~~.~~.~~
        </time>
        <span>
          ~~~~ ~~~~~
        </span>
      </div>
    </div>
    <fieldset>
      <legend class="sr-only">like:</legend>
      <label class="like-section" :for="'like-'+id">
        <Heart class="heart" :fill="false" />
        <input class="sr-only" type="checkbox" name="like" :id="'like-'+id" :checked="false">
        ? 
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
      position: absolute;
      li {
        font-size: 12px;
        padding: 4px 4px 4px 6px;
        width: fit-content;
        border-radius: 1px 5px 5px 1px;
        background-color: rgb(235, 207, 60);
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
    word-break: break-word;
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
    .heart {
      height: 21px;
      width: 21px;
      margin: 2px;
    }
  }
}
</style>