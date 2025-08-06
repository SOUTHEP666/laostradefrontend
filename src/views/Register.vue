<template>
  <div class="register-container">
    <h2>用户注册</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-item">
        <label>用户名：</label>
        <input v-model="form.username" type="text" required />
      </div>

      <div class="form-item">
        <label>密码：</label>
        <input v-model="form.password" type="password" required />
      </div>

      <div class="form-item">
        <label>角色：</label>
        <select v-model="form.role">
          <option value="buyer">买家</option>
          <option value="seller">商家</option>
        </select>
      </div>

      <button type="submit">注册</button>
    </form>

    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const BASE_URL = "https://laostrade.onrender.com/api";

const form = ref({
  username: "",
  password: "",
  role: "buyer",
});

const message = ref("");

async function handleRegister() {
  message.value = "";
  try {
    const res = await axios.post(`${BASE_URL}/auth/register`, form.value);
    message.value = res.data.message || "注册成功！";
    // 这里可以清空表单或跳转登录页
    form.value = { username: "", password: "", role: "buyer" };
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
.register-container {
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
  padding: 8px 16px;
}

.message {
  margin-top: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>
