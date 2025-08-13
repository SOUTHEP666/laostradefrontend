<template>
  <el-container style="height: 100vh;">
    <el-aside width="200px" class="sidebar">
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        router
        background-color="#001529"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/superadmin/dashboard">首页</el-menu-item>
        <el-menu-item index="/superadmin/users">用户管理</el-menu-item>
        <el-menu-item index="/superadmin/categories">分类管理</el-menu-item>
        <el-menu-item index="/superadmin/products">商品管理</el-menu-item>
        <el-menu-item index="/superadmin/logout" @click="logout">退出登录</el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <div class="header-content">
          <span>超级管理员后台</span>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
}
</script>

<style scoped>
.sidebar {
  background-color: #001529;
  color: white;
}
.header-content {
  font-size: 18px;
  padding-left: 20px;
  line-height: 60px;
  color: #333;
}
</style>
