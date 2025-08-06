<template>
  <el-card class="form-card">
    <h2>{{ $t('changePassword.title') }}</h2>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item :label="$t('changePassword.oldPassword')" prop="oldPassword">
        <el-input type="password" v-model="form.oldPassword" autocomplete="off" show-password />
      </el-form-item>

      <el-form-item :label="$t('changePassword.newPassword')" prop="newPassword">
        <el-input type="password" v-model="form.newPassword" autocomplete="off" show-password />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ $t('changePassword.submit') }}</el-button>
        <el-button @click="goProfile">{{ $t('changePassword.cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useI18n } from 'vue-i18n';
import { changePassword } from "../api/user.js";

const { t } = useI18n();
const router = useRouter();
const formRef = ref(null);
const form = ref({
  oldPassword: "",
  newPassword: "",
});

const rules = {
  oldPassword: [{ required: true, message: t('changePassword.oldPasswordPlaceholder'), trigger: "blur" }],
  newPassword: [{ required: true, message: t('changePassword.newPasswordPlaceholder'), trigger: "blur" }],
};

const onSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      const token = localStorage.getItem("token");
      await changePassword(form.value, token);
      ElMessage.success(t('changePassword.success'));
      router.push("/profile");
    } catch (error) {
      ElMessage.error(error.response?.data?.message || t('changePassword.failed'));
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
