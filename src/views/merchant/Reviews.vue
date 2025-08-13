<template>
  <div class="reviews">
    <h2>评价管理</h2>

    <el-table :data="reviews" v-loading="loading" style="width: 100%">
      <el-table-column prop="review_id" label="ID" width="80" />
      <el-table-column prop="username" label="用户" width="120" />
      <el-table-column prop="rating" label="评分" width="100">
        <template #default="{ row }">
          <el-rate :model-value="row.rating" disabled show-text></el-rate>
        </template>
      </el-table-column>
      <el-table-column prop="review_text" label="评价内容" />
      <el-table-column prop="date_created" label="日期" width="180" />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag type="success" v-if="row.is_approved">已审核</el-tag>
          <el-tag type="warning" v-else>待审核</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button
            v-if="!row.is_approved"
            size="small"
            type="success"
            @click="approveReview(row.review_id)"
          >通过</el-button>
          <el-button
            size="small"
            type="danger"
            @click="deleteReview(row.review_id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

const reviews = ref([]);
const loading = ref(false);

const fetchReviews = async () => {
  loading.value = true;
  try {
    const res = await axios.get("/api/reviews/pending", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    reviews.value = res.data;
  } catch (error) {
    ElMessage.error("获取评价失败");
  } finally {
    loading.value = false;
  }
};

const approveReview = async (reviewId) => {
  try {
    await axios.patch(`/api/reviews/${reviewId}/approve`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    ElMessage.success("审核通过");
    fetchReviews();
  } catch (error) {
    ElMessage.error("审核失败");
  }
};

const deleteReview = (reviewId) => {
  ElMessageBox.confirm("确认删除该评价？", "提示")
    .then(async () => {
      try {
        await axios.delete(`/api/reviews/${reviewId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        ElMessage.success("删除成功");
        fetchReviews();
      } catch {
        ElMessage.error("删除失败");
      }
    })
    .catch(() => {});
};

onMounted(() => {
  fetchReviews();
});
</script>

<style scoped>
.reviews {
  padding: 20px;
}
</style>
