<template>
  <div class="register">
    <h2>注册</h2>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="form.role" placeholder="请选择角色">
          <el-option label="一级管理员 (superadmin)" value="superadmin" />
          <el-option label="二级管理员 (admin)" value="admin" />
          <el-option label="商家 (merchant)" value="merchant" />
          <el-option label="买家 (buyer)" value="buyer" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="onRegister">注册</el-button>
        <el-button @click="goLogin">返回登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import request from "@/api/request";

const router = useRouter();
const formRef = ref(null);
const loading = ref(false);

const form = reactive({
  username: "",
  email: "",
  password: "",
  role: "",
});

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "邮箱格式不正确", trigger: ["blur", "change"] },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  role: [{ required: true, message: "请选择角色", trigger: "change" }],
};

const onRegister = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;
    try {
      await request.post("/auth/register", form);
      ElMessage.success("注册成功，请登录");
      router.push("/login");
    } catch (error) {
      ElMessage.error(error.response?.data?.message || "注册失败");
    } finally {
      loading.value = false;
    }
  });
};

const goLogin = () => {
  router.push("/login");
};
</script>
