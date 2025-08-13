<template>
  <nav :class="['bottom-nav', { hidden: hidden }]">
    <router-link to="/buyer/home" class="nav-item" :class="{ active: isActive('/buyer/home') }">
      <i class="iconfont icon-home"></i>
      <span>首页</span>
    </router-link>
    <router-link to="/buyer/video" class="nav-item" :class="{ active: isActive('/buyer/video') }">
      <i class="iconfont icon-video"></i>
      <span>视频</span>
    </router-link>
    <router-link to="/buyer/chat" class="nav-item" :class="{ active: isActive('/buyer/chat') }">
      <i class="iconfont icon-chat"></i>
      <span>聊天</span>
    </router-link>
    <router-link to="/buyer/cart" class="nav-item" :class="{ active: isActive('/buyer/cart') }">
      <i class="iconfont icon-cart"></i>
      <span>购物车</span>
    </router-link>
    <router-link to="/buyer/profile" class="nav-item" :class="{ active: isActive('/buyer/profile') }">
      <i class="iconfont icon-user"></i>
      <span>个人中心</span>
    </router-link>
  </nav>
</template>

<script setup>
import { useRoute } from "vue-router";

const props = defineProps({
  hidden: Boolean,
});

const route = useRoute();

function isActive(path) {
  // 支持路径前缀高亮
  return route.path === path || route.path.startsWith(path + "/");
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #fff;
  display: flex;
  border-top: 1px solid #ddd;
  z-index: 1000;
  transition: transform 0.3s ease;
}
.bottom-nav.hidden {
  transform: translateY(100%);
}
.nav-item {
  flex: 1;
  text-align: center;
  padding-top: 6px;
  font-size: 12px;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}
.nav-item.active {
  color: #409eff;
}
.iconfont {
  font-size: 20px;
  margin-bottom: 2px;
}
</style>
