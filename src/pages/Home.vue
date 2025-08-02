<!-- src/views/Home.vue -->
<template>
  <h2>欢迎回来！这是首页</h2>
  <p>你已经登录，token: {{ token }}</p>
</template>

<script setup>
const token = localStorage.getItem('token') || '未登录'
</script>
