<template>
  <el-card class="form-card">
    <h2>{{ $t('login.title') }}</h2>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item :label="$t('login.account')" prop="identifier">
        <el-input
          v-model="form.identifier"
          autocomplete="off"
          :placeholder="$t('login.placeholder.account')"
        />
      </el-form-item>
      <el-form-item :label="$t('login.password')" prop="password">
        <el-input
          v-model="form.password"
          autocomplete="off"
          show-password
          type="password"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ $t('login.submit') }}</el-button>
        <el-button @click="goRegister">{{ $t('login.register') }}</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useI18n } from 'vue-i18n'
import { login } from "../api/user.js";

const { t } = useI18n();
const router = useRouter();
const formRef = ref(null);
const form = ref({
  identifier: "",
  password: "",
});

const rules = {
  identifier: [
    { required: true, message: t('login.validate.account'), trigger: "blur" },
  ],
  password: [
    { required: true, message: t('login.validate.password'), trigger: "blur" },
  ],
};

const onSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      const res = await login(form.value);
      localStorage.setItem("token", res.data.token);
      ElMessage.success(t('login.success'));
      router.push("/home");
    } catch (error) {
      ElMessage.error(error.response?.data?.message || t('login.failed'));
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
