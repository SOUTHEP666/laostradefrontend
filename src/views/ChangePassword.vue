<template>
  <el-card class="form-card">
    <h2>修改密码</h2>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input type="password" v-model="form.oldPassword" autocomplete="off" show-password />
      </el-form-item>

      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="form.newPassword" autocomplete="off" show-password />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改密码</el-button>
        <el-button @click="goProfile">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { changePassword } from "../api/user.js";

const router = useRouter();
const formRef = ref(null);
const form = ref({
  oldPassword: "",
  newPassword: "",
});

const rules = {
  oldPassword: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }],
};

const onSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      const token = localStorage.getItem("token");
      await changePassword(form.value, token);
      ElMessage.success("密码修改成功");
      router.push("/profile");
    } catch (error) {
      ElMessage.error(error.response?.data?.message || "修改失败");
    }
  });
};

const goProfile = () => {
  router.push("/profile");
};
</script>

<style scoped>
.form-card {
  max-width: 400px;
  margin: 60px auto;
  padding: 20px;
}
</style>
