<template>
  <div class="images">
    <h2>商品图片管理</h2>

    <el-upload
      action="/api/images/{{productId}}"
      :headers="uploadHeaders"
      multiple
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :on-remove="handleRemove"
      :file-list="fileList"
      :data="uploadData"
    >
      <i class="el-icon-plus"></i>
    </el-upload>

    <el-table :data="images" style="width: 100%" v-loading="loading">
      <el-table-column prop="image_id" label="图片ID" width="100" />
      <el-table-column label="图片" width="180">
        <template #default="{ row }">
          <img :src="row.image_url" alt="商品图片" style="width: 160px; height: 100px; object-fit: cover;" />
        </template>
      </el-table-column>
      <el-table-column prop="alt_text" label="描述" />
      <el-table-column prop="is_primary" label="主图" width="80">
        <template #default="{ row }">
          <el-tag type="success" v-if="row.is_primary">主图</el-tag>
          <el-tag v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort_order" label="排序" width="80" />
      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button size="small" @click="setPrimary(row)" :disabled="row.is_primary">设为主图</el-button>
          <el-button size="small" type="danger" @click="deleteImage(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

const productId = ref(null); // 你可以通过props或者路由传入实际的productId

const images = ref([]);
const loading = ref(false);
const fileList = ref([]);

const uploadHeaders = {
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
};

const uploadData = {
  // 如果你需要额外参数，写这里
};

const fetchImages = async () => {
  if (!productId.value) return;
  loading.value = true;
  try {
    const res = await axios.get(`/api/images/${productId.value}`, {
      headers: uploadHeaders,
    });
    images.value = res.data;
    fileList.value = images.value.map(img => ({
      name: img.image_url.split('/').pop(),
      url: img.image_url,
      uid: img.image_id,
    }));
  } catch (error) {
    ElMessage.error("获取图片失败");
  } finally {
    loading.value = false;
  }
};

const handleUploadSuccess = (response, file) => {
  ElMessage.success("上传成功");
  fetchImages();
};

const handleRemove = (file, fileList) => {
  // 你可以在这里调用接口删除图片，或者使用下方删除函数
};

const setPrimary = async (image) => {
  try {
    const res = await axios.patch(
      `/api/images/${image.image_id}/set-primary`,
      {},
      { headers: uploadHeaders }
    );
    ElMessage.success("设置主图成功");
    fetchImages();
  } catch (error) {
    ElMessage.error("设置主图失败");
  }
};

const deleteImage = (image) => {
  ElMessageBox.confirm("确定删除这张图片？", "提示")
    .then(async () => {
      try {
        await axios.delete(`/api/images/${image.image_id}`, {
          headers: uploadHeaders,
        });
        ElMessage.success("删除成功");
        fetchImages();
      } catch {
        ElMessage.error("删除失败");
      }
    })
    .catch(() => {});
};

onMounted(() => {
  // productId赋值逻辑
  fetchImages();
});
</script>

<style scoped>
.images {
  padding: 20px;
}
</style>
