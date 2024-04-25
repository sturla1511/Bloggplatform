<script setup>
import { tags } from "~/assets/utils/tags.ts";
import { tagColor } from "~/assets/utils/tags.ts";
import { usePreferenceStore } from "~/stores/Preferences.ts";
import {ref} from "vue";

const preference = usePreferenceStore();
let selectedTags = ref(preference?.tagPreferences ?? []);
function selectTag(selected) {
  preference.addOrRemoveTag(selected);
  preference.getTags(selected);
}
</script>

<template>
  <div v-if="preference.isUserNew" class="interest-picker">
    <h1>Velg intereser</h1>
    <ul class="tags">
      <li
        v-for="tag in tags"
        class="tag"
        :key="tag"
      >
        <label 
          :style="'background-color: ' + tagColor(tag) + ';'"
          :class="{'tag-selected': selectedTags?.includes(tag)}"
        >
          {{ tag }}
          <input
            type="checkbox"
            class="sr-only"
            :checked="selectedTags?.includes(tag)"
            @click="selectTag(tag)"
          >
          <CheckboxIcon :checked="selectedTags?.includes(tag)" class="icon"/>
        </label>
      </li>
    </ul>
    <button class="save-interests" @click="preference.setUser()">Lagre interese</button>
  </div>
</template>

<style scoped lang="scss">
.interest-picker {
  display: flex;
  flex-flow: column;
  padding: 10px;
  width: fit-content;
  .tags {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: wrap;
    gap: 8px;
    .tag {
      display: flex;
      font-size: 14px;
      height: fit-content;
      label {
        display: flex;
        height: 20px;
        padding: 4px 4px 4px 6px;
        border-radius: 5px;
        filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.25));
        cursor: pointer;
        gap: 2px;
        align-items: center;
        .icon {
          width: 20px;
          height: 18px;
        }
        &:hover {
          .icon {
            height: 20px;
          }
        }
      }
    }
  }
  .save-interests {
    width: fit-content;
    padding: 8px;
    border: none;
    border-radius: 5px;
    margin-top: 24px;
    font-size: 16px;
    background-color: $background-color;
    cursor: pointer;
    filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.25));
    &:hover {
      background-color: darken($background-color, 5%);
    }
    &:active {
      filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.25));
    }
  }
}

@media (min-width: $breakpoint-sm) {
  .interest-picker {
    padding: 16px;
  }
}
@media (min-width: $breakpoint-md) {
  .interest-picker {
    padding: 36px;
  }
}
</style>