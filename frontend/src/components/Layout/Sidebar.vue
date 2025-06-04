<template>
  <div class="menu">
    <template v-for="(item, index) in listSidebar.menuItems" :key="index">
      <span v-if="item?.separator" class="separator"></span>
      <router-link
        v-else-if="item?.href"
        :to="item?.href"
        :class="['menu-items', { collapsed: isCollapsed }]"
        active-class="active"
        @click="handleMenuClick(item)"
      >
        <img :src="item?.icon ?? ''" alt="" />
        <span v-if="!isCollapsed" class="menu-item-name">{{ item?.name ?? '' }}</span>
      </router-link>
      <div
        v-else
        :class="['menu-items', { collapsed: isCollapsed }]"
        @click="handleMenuClick(item)"
      >
        <img :src="item?.icon ?? ''" alt="" />
        <span v-if="!isCollapsed" class="menu-item-name">{{ item?.name ?? '' }}</span>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps } from 'vue'
import { listSidebar } from '@/constants/index'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const props = defineProps({
  isCollapsed: Boolean,
})

const router = useRouter()
const authStore = useAuthStore()

const handleMenuClick = async (item: any) => {
  if (item?.action === 'logout') {
    await authStore.logout()
  } else if (item?.href) {
    router.push(item.href)
  }
}
</script>

<style scoped lang="scss">
.separator {
  border-top: 1px solid #e0e0e0;
  width: 100%;
  margin: 10px 0px;
}

.menu {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-top: 10px;
  gap: 3px;
}

.menu-items {
  padding: 13px 5px 16px 15px;
  height: 25px;
  width: 190px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 14px;
  transition: margin-left 0.4s ease;
}

.menu-items:hover {
  background-color: var(--theme-color);
  border-radius: 5px;
}

.menu-items:last-child:hover {
  background-color: red;
  border-radius: 5px;
  cursor: pointer;
}

.menu-items.active {
  background-color: var(--theme-color);
  border-radius: 5px;
}

.menu-items.collapsed {
  width: 30px;
  justify-content: center;
  margin-left: 10px;
  padding-left: 10px;
  padding-right: 10px;
  transition: margin-left 0.4s ease;
}

.menu-items.active .menu-item-name {
  color: white;
}

.menu-items.active img {
  filter: invert(1);
}

.menu-item-name {
  color: black;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: -2px;
}

.menu-items:hover .menu-item-name {
  color: white;
}

.menu-items:hover img {
  filter: invert(1);
}

.menu-items img {
  width: 16px;
  height: 16px;
}
</style>
