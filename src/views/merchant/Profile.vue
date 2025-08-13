<template>
  <div class="profile">
    <h2>店铺资料管理</h2>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" style="max-width: 600px;">
      <el-form-item label="店铺名称" prop="store_name">
        <el-input v-model="form.store_name" placeholder="请输入店铺名称" />
      </el-form-item>

      <el-form-item label="店铺描述" prop="description">
        <el-input
          type="textarea"
          v-model="form.description"
          placeholder="请输入店铺描述"
          :rows="4"
        />
      </el-form-item>

      <el-form-item label="店铺Logo">
        <el-upload
          class="avatar-uploader"
          action="/api/merchant/upload-logo"
          :headers="uploadHeaders"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload"
        >
          <img v-if="form.logo_url" :src="form.logo_url" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";

const formRef = ref(null);
const form = ref({
  store_name: "",
  description: "",
  logo_url: "",
});

const rules = {
  store_name: [{ required: true, message: "店铺名称不能为空", trigger: "blur" }],
  description: [{ required: true, message: "店铺描述不能为空", trigger: "blur" }],
};

const uploadHeaders = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

const fetchProfile = async () => {
  try {
    const res = await axios.get("/api/merchant/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.data) {
      form.value.store_name = res.data.store_name || "";
      form.value.description = res.data.description || "";
      form.value.logo_url = res.data.logo_url || "";
    }
  } catch (error) {
    ElMessage.error("获取店铺资料失败");
  }
};

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      await axios.put(
        "/api/merchant/me",
        {
          store_name: form.value.store_name,
          description: form.value.description,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      ElMessage.success("店铺资料保存成功");
    } catch (error) {
      ElMessage.error("保存失败");
    }
  });
};

const handleUploadSuccess = (res) => {
  if (res && res.logo_url) {
    form.value.logo_url = res.logo_url;
    ElMessage.success("Logo上传成功");
  } else {
    ElMessage.error("Logo上传失败");
  }
};

const beforeUpload = (file) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    ElMessage.error("只能上传图片文件");
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过 2MB");
    return false;
  }
  return true;
};

onMounted(() => {
  fetchProfile();
});
</script>

<style scoped>
.avatar-uploader {
  display: inline-block;
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
