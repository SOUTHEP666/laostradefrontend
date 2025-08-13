<template>
  <div>
    <h2>商家审核状态</h2>
    <el-card v-if="status">
      <p>当前审核状态：<strong>{{ status }}</strong></p>
    </el-card>
    <el-empty v-else description="暂无状态信息"></el-empty>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const status = ref(null);

async function fetchStatus() {
  try {
    const res = await axios.get('/api/merchants/status');
    status.value = res.data.status;
  } catch (error) {
    status.value = null;
  }
}

onMounted(() => {
  fetchStatus();
});
</script>
