<template>
  <el-card class="form-card">
    <h2>注册账号</h2>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" autocomplete="off" placeholder="020开头的老挝手机号" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" autocomplete="off" />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" autocomplete="off" show-password type="password" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">注册</el-button>
        <el-button @click="goLogin">去登录</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { register } from "../api/user.js";

const router = useRouter();
const formRef = ref(null);
const form = ref({
  username: "",
  phone: "",
  email: "",
  password: "",
});

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
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const onSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      await register(form.value);
      ElMessage.success("注册成功，自动跳转登录");
      router.push("/login");
    } catch (error) {
      ElMessage.error(error.response?.data?.message || "注册失败");
    }
  });
};

const goLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.form-card {
  max-width: 400px;
  margin: 60px auto;
  padding: 20px;
}
</style>
