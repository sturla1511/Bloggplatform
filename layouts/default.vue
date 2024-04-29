<template>
  <div>
    <main>
      <div class="page-content-container">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
main {
  display: flex;
  justify-content: center;
}
.page-content-container {
  background-color: white;
  max-width: $max-width;
  width: 100%;
  min-height: calc(100vh - 80px);
  border-radius: 8px;
  margin: 40px 0;
}
@media (min-width: $breakpoint-sm) {
  .page-content-container {
    margin: 40px 20px;
  }
}
@media (min-width: $breakpoint-md) {
  .page-content-container {
    margin: 40px 30px;
  }
}
</style>