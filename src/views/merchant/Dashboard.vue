<template>
  <div>
    <h2>欢迎，{{ user.store_name || user.username || '商家' }}</h2>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="6">
        <el-card>
          <div>商品总数</div>
          <div style="font-size: 28px; font-weight: bold;">{{ stats.productCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div>订单总数</div>
          <div style="font-size: 28px; font-weight: bold;">{{ stats.orderCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div>待处理订单</div>
          <div style="font-size: 28px; font-weight: bold;">{{ stats.pendingOrders }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div>评价总数</div>
          <div style="font-size: 28px; font-weight: bold;">{{ stats.reviewCount }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const user = JSON.parse(localStorage.getItem('user') || '{}');

const stats = ref({
  productCount: 0,
  orderCount: 0,
  pendingOrders: 0,
  reviewCount: 0,
});

async function fetchStats() {
  try {
    const res = await axios.get('/api/merchant/dashboard-stats', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    // 确保接口返回的字段符合预期，否则默认0
    stats.value.productCount = res.data.productCount ?? 0;
    stats.value.orderCount = res.data.orderCount ?? 0;
    stats.value.pendingOrders = res.data.pendingOrders ?? 0;
    stats.value.reviewCount = res.data.reviewCount ?? 0;
  } catch (error) {
    console.error('获取统计数据失败', error);
  }
}

onMounted(() => {
  fetchStats();
});
</script>
