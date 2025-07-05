<template>
  <div class="skeleton-news-card">
    <div class="skeleton-image"></div>
    <div class="skeleton-line"></div>
  </div>
</template>

<style scoped>
.skeleton-news-card {
  display: flex;
  gap: 12px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  height: 80px;
  align-items: center;
  padding: 8px;
}
.skeleton-image {
  width: 96px;
  height: 72px;
  background: #ddd;
  border-radius: 4px;
}
.skeleton-line {
  flex: 1;
  height: 12px;
  background: #ccc;
  border-radius: 4px;
}
</style>
