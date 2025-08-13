<template>
  <div class="buyer-profile">
    <h2>个人中心</h2>
    <p>这里是用户的个人信息和设置页面。</p>
    <LogoutButton />
  </div>
</template>

<script setup>
import LogoutButton from '@/components/LogoutButton.vue'
</script>

<style scoped>
.buyer-profile {
  padding: 16px;
}
</style>
