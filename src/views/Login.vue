<template>
  <div class="login">
    <h2>登录</h2>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="账号" prop="account">
        <el-input v-model="form.account" placeholder="用户名或邮箱" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" placeholder="密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="onLogin">登录</el-button>
        <el-button @click="goRegister">去注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import request from "@/api/request"; // 你请求封装，axios实例

const router = useRouter();
const formRef = ref(null);
const loading = ref(false);

const form = reactive({
  account: "",
  password: "",
});

const rules = {
  account: [{ required: true, message: "请输入用户名或邮箱", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const onLogin = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;
    try {
      const res = await request.post("/auth/login", form);
      const { token, user } = res;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      ElMessage.success("登录成功");

      // 跳转到对应角色首页
      const roleHomeMap = {
        superadmin: "/superadmin/dashboard",
        admin: "/admin/dashboard",
        merchant: "/merchant/dashboard",
        buyer: "/buyer/home",
      };
      router.push(roleHomeMap[user.role] || "/login");
    } catch (error) {
      ElMessage.error(error.response?.data?.message || "登录失败，请检查账号密码");
    } finally {
      loading.value = false;
    }
  });
};

const goRegister = () => {
  router.push("/register");
};
</script>
