<template>
  <nav class="breadcrumb-container" aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="breadcrumb-item"
        :class="{ active: index === items.length - 1 }"
      >
        <router-link v-if="index < items.length - 1" :to="item.to">{{ item.text }}</router-link>
        <span v-else>{{ item.text }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  text: string
  to: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<style scoped lang="scss">
.breadcrumb-container {
  margin-bottom: 30px;
  margin-top: 10px;
}

.breadcrumb {
  display: flex;
  list-style: none;
  padding: 8px 0;
  margin: 0;

  &-item {
    font-size: 14px;
    color: #666;

    a {
      color: #666;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: #8e44ad;
        text-decoration: underline;
      }
    }

    &:not(:last-child)::after {
      content: '/';
      margin: 0 8px;
      color: #ccc;
    }

    &.active {
      color: #8e44ad;
      font-weight: 500;
    }
  }
}
</style>
