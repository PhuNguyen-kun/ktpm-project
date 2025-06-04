<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header" header>
        <Header @toggleSidebar="toggleSidebar" />
      </el-header>
      <el-container>
        <el-aside :class="['sidebar', { 'sidebar-collapsed': isCollapsed }]">
          <Sidebar :isCollapsed="isCollapsed" />
        </el-aside>
        <el-main :class="['main', { 'main-collapsed': isCollapsed }]">
          <RouterView></RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import Header from '@/components/Layout/Header.vue'
import Sidebar from '@/components/Layout/Sidebar.vue'
import { ref } from 'vue'

const isCollapsed = ref(false)
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped lang="scss">
.common-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  overflow: hidden;
}

.wrapper {
  display: flex;
  width: 100%;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  z-index: 1000;
  background-color: white;
}

.sidebar {
  position: fixed;
  top: 70px;
  left: 0;
  width: 240px;
  height: calc(100vh - 70px);
  background-color: #fff;
  z-index: 999;
  transition: width 0.3s ease;
  border-right: 1px solid #ebebeb;
}

.sidebar-collapsed {
  width: 70px;
  padding-left: -500px;
}

.main {
  margin-left: 240px;
  margin-top: 70px;
  padding: 30px;
  background-color: #f5f6fa;
  height: calc(100vh - 70px);
  overflow-y: auto;
  transition: margin-left 0.3s ease;
}

.main-collapsed {
  margin-left: 70px;
}
</style>
