<template>
  <div class="register">
    <h2>注册</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="name" placeholder="姓名" required />
      <input v-model="email" type="email" placeholder="邮箱" required />
      <input v-model="password" type="password" placeholder="密码" required />
      <button type="submit">注册</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      password: ''
    }
  },
  methods: {
    async handleRegister() {
      const res = await fetch('https://laosecom.onrender.com/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.name,
          email: this.email,
          password: this.password
        })
      })
      const data = await res.json()
      alert(JSON.stringify(data))
    }
  }
}
</script>
