<template>
  <el-card class="home-card">
    <h2>欢迎来到首页</h2>
    <p>这里是登录后的主页，你可以在这里展示你的产品、推荐信息或其他内容。</p>
    <el-button type="primary" @click="goProfile">查看个人资料</el-button>
    <el-button @click="logout">退出登录</el-button>
  </el-card>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goProfile = () => {
  router.push("/profile");
};

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>

<style scoped>
.home-card {
  max-width: 600px;
  margin: 60px auto;
  padding: 20px;
  text-align: center;
}
</style>
