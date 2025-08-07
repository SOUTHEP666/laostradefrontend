<template>
  <div class="register-container">
    <h2>注册</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="username" placeholder="用户名" required />
      <input v-model="email" type="email" placeholder="邮箱" required />
      <input v-model="phone" placeholder="联系电话（老挝电话）" required />
      <input v-model="password" type="password" placeholder="密码" required />
      <input v-model="confirmPassword" type="password" placeholder="确认密码" required />
      <select v-model.number="role" required>
        <option value="" disabled>请选择身份</option>
        <option :value="1">买家</option>
        <option :value="2">商家</option>
        <option :value="3">一级管理员</option>
        <option :value="4">二级管理员</option>
      </select>
      <button type="submit" :disabled="loading">注册</button>
    </form>

    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    <p v-if="successMsg" class="success">{{ successMsg }}</p>

    <p style="margin-top: 12px;">
      已有账号？
      <button @click="goLogin" type="button" class="link-btn">去登录</button>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import request from "@/utils/request.js";
import { useRouter } from "vue-router";

const username = ref("");
const email = ref("");
const phone = ref("");
const password = ref("");
const confirmPassword = ref("");
const role = ref(null);

const errorMsg = ref("");
const successMsg = ref("");
const loading = ref(false);

const router = useRouter();

async function handleRegister() {
  errorMsg.value = "";
  successMsg.value = "";

  if (password.value !== confirmPassword.value) {
    errorMsg.value = "两次密码输入不一致";
    return;
  }

  if (!role.value) {
    errorMsg.value = "请选择身份";
    return;
  }

  loading.value = true;

  try {
    const res = await request.post("/auth/register", {
      username: username.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
      role: role.value,
    });
    successMsg.value = "注册成功，请登录！";
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  } catch (error) {
    errorMsg.value = error.response?.data?.message || "注册失败";
  } finally {
    loading.value = false;
  }
}

function goLogin() {
  router.push("/login");
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
input,
select {
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
.success {
  color: green;
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
