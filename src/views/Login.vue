<template>
  <div class="auth-container">
    <h2>{{ isRegister ? "注册" : "登录" }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-item">
        <label>用户名：</label>
        <input v-model="form.username" type="text" required />
      </div>

      <div class="form-item">
        <label>密码：</label>
        <input v-model="form.password" type="password" required />
      </div>

      <div v-if="isRegister" class="form-item">
        <label>角色：</label>
        <select v-model="form.role">
          <option value="buyer">买家</option>
          <option value="seller">商家</option>
        </select>
      </div>

      <button type="submit">{{ isRegister ? "注册" : "登录" }}</button>
      <button type="button" @click="toggleMode">
        切换到 {{ isRegister ? "登录" : "注册" }}
      </button>
    </form>

    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const BASE_URL = "https://laostrade.onrender.com/api";

const isRegister = ref(false);
const message = ref("");

const form = ref({
  username: "",
  password: "",
  role: "buyer",
});

function toggleMode() {
  isRegister.value = !isRegister.value;
  message.value = "";
  // 清空表单数据
  form.value = { username: "", password: "", role: "buyer" };
}

async function handleSubmit() {
  message.value = "";
  try {
    if (isRegister.value) {
      const res = await axios.post(`${BASE_URL}/auth/register`, form.value);
      message.value = res.data.message || "注册成功！";
    } else {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        username: form.value.username,
        password: form.value.password,
      });
      message.value = "登录成功！Token: " + res.data.token;
      localStorage.setItem("token", res.data.token);
      // 这里可以触发登录后跳转等操作
    }
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      message.value = err.response.data.message;
    } else {
      message.value = "请求失败，请重试";
    }
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: Arial, sans-serif;
}

.form-item {
  margin-bottom: 16px;
}

.form-item label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
}

.form-item input,
.form-item select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  margin-right: 10px;
  padding: 8px 16px;
}

.message {
  margin-top: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>
