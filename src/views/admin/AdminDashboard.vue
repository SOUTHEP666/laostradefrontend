<template>
  <div class="admin-dashboard-layout">
    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical-demo"
      router
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="/admin/dashboard">首页</el-menu-item>
      <el-menu-item index="/admin/merchants">商家管理</el-menu-item>
      <el-menu-item index="/admin/orders">订单管理</el-menu-item>
      <el-menu-item index="/admin/reviews">评价管理</el-menu-item>
      <el-menu-item index="/admin/products">商品管理</el-menu-item>
      <el-menu-item @click="logout">退出登录</el-menu-item>
    </el-menu>

    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const activeMenu = ref(route.path);

// 监听路由变化，更新激活菜单项
watch(() => route.path, val => {
  activeMenu.value = val;
});

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
};
</script>

<style scoped>
.el-menu-vertical-demo {
  width: 200px;
  min-height: 100vh;
  float: left;
}

.content {
  margin-left: 200px;
  padding: 20px;
}
</style>
