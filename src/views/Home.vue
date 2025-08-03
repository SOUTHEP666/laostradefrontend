<template>
  <el-card class="login-card">
    <h2>登录</h2>
    <el-form :model="form">
      <el-form-item label="用户名或邮箱">
        <el-input v-model="form.identity" placeholder="用户名或邮箱" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
        <el-button type="text" @click="$router.push('/register')">没有账号？注册</el-button>
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
  identity: '',  // 可输入邮箱或用户名
  password: ''
})

const handleLogin = async () => {
  try {
    const res = await axios.post('https://laosecom.onrender.com/api/user/login', form.value)
    localStorage.setItem('token', res.data.token)
    router.push('/home')
  } catch (err) {
    alert(err.response?.data?.message || '登录失败')
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
