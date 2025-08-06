<template>
  <div class="home-layout">
    <main class="content">
      <router-view />
    </main>
    <nav class="bottom-nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
      >
        {{ item.name }}
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: "HomeLayout",
  data() {
    return {
      navItems: [
        { path: "/home", name: "首页" },
        { path: "/category", name: "分类" },
        { path: "/chat", name: "聊天" },
        { path: "/cart", name: "购物车" },
        { path: "/profile", name: "我的" },
      ],
    };
  },
  methods: {
    isActive(path) {
      return this.$route.path.startsWith(path);
    },
  },
};
</script>

<style scoped>
.home-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 60px; /* 留出底部导航栏高度 */
  background-color: #f9f9f9;
}
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  background: #24292e;
  z-index: 100;
}
.nav-item {
  flex: 1;
  text-align: center;
  line-height: 60px;
  color: #ccc;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}
.nav-item.active {
  color: #ff6700;
  font-weight: bold;
}
</style>
