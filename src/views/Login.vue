<template>
  <div class="login-container">
    <h2>登录</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="account" placeholder="用户名或邮箱" required />
      <input type="password" v-model="password" placeholder="密码" required />
      <button type="submit" :disabled="loading">登录</button>
    </form>
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    <p style="margin-top: 12px;">
      还没账号？
      <button @click="goRegister" type="button" class="link-btn">去注册</button>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import request from "@/utils/request.js";
import { useRouter } from "vue-router";

const account = ref("");
const password = ref("");
const errorMsg = ref("");
const loading = ref(false);
const router = useRouter();

async function handleLogin() {
  errorMsg.value = "";
  loading.value = true;

  try {
    const res = await request.post("/auth/login", {
      account: account.value,
      password: password.value,
    });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    // 根据身份跳转
    switch (res.data.user.role) {
      case 1:
        router.push("/buyer-home");
        break;
      case 2:
        router.push("/seller-home");
        break;
      case 3:
        router.push("/admin1-home");
        break;
      case 4:
        router.push("/admin2-home");
        break;
      default:
        router.push("/");
    }
  } catch (error) {
    errorMsg.value = error.response?.data?.message || "登录失败";
  } finally {
    loading.value = false;
  }
}

function goRegister() {
  router.push("/register");
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
input {
  display: block;
  width: 100%;
  margin-bottom: 12px;
  padding: 8px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 10px;
}
.error {
  color: red;
  margin-top: 8px;
}
.link-btn {
  color: blue;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
</style>
