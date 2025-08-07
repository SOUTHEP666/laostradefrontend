<template>
  <div class="home">
    <h2>买家主页</h2>
    <p>欢迎，{{ user.username }}！您的身份是：买家</p>
    <button @click="logout">退出登录</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
}
</script>

<style scoped>
.home {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
}
button {
  margin-top: 20px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
