<!-- src/views/Register.vue -->
<template>
  <el-card class="login-card">
    <h2>注册</h2>
    <el-form :model="form">
      <el-form-item label="用户名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleRegister">注册</el-button>
        <el-button type="text" @click="$router.push('/login')">已有账号？登录</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
const router = useRouter()

const form = ref({
  username: '',
  email: '',
  password: ''
})

const handleRegister = async () => {
  try {
    await axios.post('https://laosecom.onrender.com/api/user/register', form.value)
    alert('注册成功，请登录')
    router.push('/login')
  } catch (err) {
    alert(err.response?.data?.message || '注册失败')
  }
}
</script>

<style scoped>
.login-card {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
}
</style>
