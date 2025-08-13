<template>
  <div>
    <h2>欢迎回来，超级管理员！</h2>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="number">{{ stats.users }}</div>
            <div class="label">用户总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="number">{{ stats.products }}</div>
            <div class="label">商品总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="number">{{ stats.categories }}</div>
            <div class="label">分类总数</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const stats = ref({
  users: 0,
  products: 0,
  categories: 0,
});

const fetchStats = async () => {
  try {
    const [usersRes, productsRes, categoriesRes] = await Promise.all([
      axios.get('/api/admin/users?limit=1&page=1'), // 获取总数用total字段
      axios.get('/api/merchant/products?limit=1&page=1'), // 这里按需调整接口
      axios.get('/api/categories'),
    ]);

    stats.value.users = usersRes.data.total || 0;
    stats.value.products = productsRes.data.total || 0;
    stats.value.categories = categoriesRes.data.length || 0;
  } catch (err) {
    console.error('获取统计数据失败', err);
  }
};

onMounted(() => {
  fetchStats();
});
</script>

<style scoped>
.card-content {
  text-align: center;
}
.number {
  font-size: 36px;
  font-weight: bold;
}
.label {
  margin-top: 5px;
  color: #666;
}
</style>
