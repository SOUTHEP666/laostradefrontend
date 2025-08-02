<!-- src/views/Home.vue -->
<template>
  <el-card class="home-card">
    <h2>欢迎回来！</h2>
    <div v-if="user">
      <p><strong>用户名：</strong> {{ user.username }}</p>
      <p><strong>邮箱：</strong> {{ user.email }}</p>
    </div>
    <div v-else>
      <p>正在加载用户信息...</p>
    </div>
    <el-button type="danger" @click="logout">退出登录</el-button>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)

const fetchUser = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }

  try {
    const res = await axios.get('https://laosecom.onrender.com/api/user/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    user.value = res.data
  } catch (err) {
    console.error(err)
    alert('身份验证失败，请重新登录')
    router.push('/login')
  }
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

onMounted(fetchUser)
</script>

<style scoped>
.home-card {
  max-width: 600px;
  margin: 100px auto;
  padding: 20px;
}
</style>
