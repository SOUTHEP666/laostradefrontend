<template>
  <div class="home">
    <h1>欢迎来到客户首页</h1>
    <p>这是你的首页内容。</p>
    <router-link to="/login">登录</router-link> |
    <router-link to="/register">注册</router-link>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
