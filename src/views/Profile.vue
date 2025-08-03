<template>
  <el-card class="form-card" v-if="profile">
    <h2>个人资料</h2>
    <el-form :model="profile" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="profile.username" />
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input v-model="profile.phone" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="profile.email" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onUpdate">保存</el-button>
        <el-button @click="goChangePassword">修改密码</el-button>
        <el-button @click="logout">退出登录</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getProfile, updateProfile } from "../api/user.js";

const router = useRouter();
const formRef = ref(null);
const profile = ref(null);

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^020\d{7,8}$/,
      message: "手机号格式不正确，应以020开头，后跟7-8位数字",
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      type: "email",
      message: "邮箱格式不正确",
      trigger: ["blur", "change"],
    },
  ],
};

const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const res = await getProfile(token);
    profile.value = res.data.profile;
  } catch (error) {
    ElMessage.error("获取资料失败，请重新登录");
    router.push("/login");
  }
};

const onUpdate = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      const token = localStorage.getItem("token");
      await updateProfile(profile.value, token);
      ElMessage.success("资料更新成功");
    } catch (error) {
      ElMessage.error(error.response?.data?.message || "更新失败");
    }
  });
};

const goChangePassword = () => {
  router.push("/change-password");
};

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};

onMounted(() => {
  fetchProfile();
});
</script>

<style scoped>
.form-card {
  max-width: 400px;
  margin: 60px auto;
  padding: 20px;
}
</style>
