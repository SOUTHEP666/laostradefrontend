<template>
  <el-card class="form-card">
    <h2>{{ $t('register.title') }}</h2>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item :label="$t('register.username')" prop="username">
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>

      <el-form-item :label="$t('register.phone')" prop="phone">
        <el-input v-model="form.phone" autocomplete="off" :placeholder="$t('register.phonePlaceholder')" />
      </el-form-item>

      <el-form-item :label="$t('register.email')" prop="email">
        <el-input v-model="form.email" autocomplete="off" />
      </el-form-item>

      <el-form-item :label="$t('register.password')" prop="password">
        <el-input v-model="form.password" autocomplete="off" show-password type="password" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ $t('register.submit') }}</el-button>
        <el-button @click="goLogin">{{ $t('register.toLogin') }}</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useI18n } from 'vue-i18n';
import { register } from "../api/user.js";

const { t } = useI18n();
const router = useRouter();
const formRef = ref(null);
const form = ref({
  username: "",
  phone: "",
  email: "",
  password: "",
});

const rules = {
  username: [{ required: true, message: t('register.validate.username'), trigger: "blur" }],
  phone: [
    { required: true, message: t('register.validate.phoneRequired'), trigger: "blur" },
    {
      pattern: /^020\d{7,8}$/,
      message: t('register.validate.phoneInvalid'),
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: t('register.validate.emailRequired'), trigger: "blur" },
    {
      type: "email",
      message: t('register.validate.emailInvalid'),
      trigger: ["blur", "change"],
    },
  ],
  password: [{ required: true, message: t('register.validate.password'), trigger: "blur" }],
};

const onSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      await register(form.value);
      ElMessage.success(t('register.success'));
      router.push("/login");
    } catch (error) {
      ElMessage.error(error.response?.data?.message || t('register.failed'));
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
