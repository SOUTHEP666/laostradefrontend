<template>
  <div class="home-container">
    <h1>欢迎来到首页</h1>
    <p>这是一个简单的 Vue 3 组件示例。</p>
  </div>
</template>

<script setup>
// 这里是 Vue 3 <script setup> 语法部分
// 你可以在这里写响应式变量、方法等

import { ref } from 'vue';

const message = ref('这是首页的欢迎信息');
</script>

<style scoped>
.home-container {
  padding: 20px;
  text-align: center;
  color: #333;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

p {
  font-size: 1.2em;
}
</style>
