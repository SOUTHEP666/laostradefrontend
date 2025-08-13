<template>
  <div>
    <h2>商家申请列表</h2>
    <el-table :data="merchants" style="width: 100%">
      <el-table-column prop="store_name" label="店铺名称" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="approve(row.application_id)" type="success" :disabled="row.status !== 'pending'">通过</el-button>
          <el-button size="small" @click="reject(row.application_id)" type="danger" :disabled="row.status !== 'pending'">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";

const merchants = ref([]);

const fetchMerchants = async () => {
  try {
    const res = await axios.get("/api/merchants/apply/pending", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    merchants.value = res.data.data; // 这里取 data 字段
  } catch (e) {
    ElMessage.error("获取商家列表失败");
  }
};

const approve = async (id) => {
  try {
    await axios.patch(`/api/merchants/apply/${id}/approve`, null, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    ElMessage.success("审核通过");
    fetchMerchants();
  } catch (e) {
    ElMessage.error("审核失败");
  }
};

const reject = async (id) => {
  try {
    await axios.patch(`/api/merchants/apply/${id}/reject`, null, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    ElMessage.success("审核拒绝");
    fetchMerchants();
  } catch (e) {
    ElMessage.error("审核失败");
  }
};

onMounted(() => {
  fetchMerchants();
});
</script>
