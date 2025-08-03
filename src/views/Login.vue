<template>
  <el-card class="form-card">
    <h2>登录</h2>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="账号" prop="identifier">
        <el-input v-model="form.identifier" autocomplete="off" placeholder="用户名或邮箱" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" autocomplete="off" show-password type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
        <el-button @click="goRegister">去注册</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { login } from "../api/user.js";

const router = useRouter();
const formRef = ref(null);
const form = ref({
  identifier: "",
  password: "",
});

const rules = {
  identifier: [{ required: true, message: "请输入用户名或邮箱", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const onSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      const res = await login(form.value);
      localStorage.setItem("token", res.data.token);
      ElMessage.success("登录成功");
      router.push("/home");
    } catch (error) {
      ElMessage.error(error.response?.data?.message || "登录失败");
    }
  });
};

const goRegister = () => {
  router.push("/register");
};
</script>

<style scoped>
.form-card {
  max-width: 400px;
  margin: 60px auto;
  padding: 20px;
}
</style>
