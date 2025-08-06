<template>
  <el-card class="form-card" v-if="profile">
    <h2>{{ $t('profile.title') }}</h2>
    <el-form :model="profile" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item :label="$t('profile.username')" prop="username">
        <el-input v-model="profile.username" />
      </el-form-item>

      <el-form-item :label="$t('profile.phone')" prop="phone">
        <el-input v-model="profile.phone" />
      </el-form-item>

      <el-form-item :label="$t('profile.email')" prop="email">
        <el-input v-model="profile.email" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onUpdate">{{ $t('profile.save') }}</el-button>
        <el-button @click="goChangePassword">{{ $t('profile.changePassword') }}</el-button>
        <el-button @click="logout">{{ $t('profile.logout') }}</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useI18n } from 'vue-i18n';
import { getProfile, updateProfile } from "../api/user.js";

const { t } = useI18n();
const router = useRouter();
const formRef = ref(null);
const profile = ref(null);

const rules = {
  username: [{ required: true, message: t('profile.validate.username'), trigger: "blur" }],
  phone: [
    { required: true, message: t('profile.validate.phoneRequired'), trigger: "blur" },
    {
      pattern: /^020\d{7,8}$/,
      message: t('profile.validate.phoneInvalid'),
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: t('profile.validate.emailRequired'), trigger: "blur" },
    {
      type: "email",
      message: t('profile.validate.emailInvalid'),
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
    ElMessage.error(t('profile.loadError'));
    router.push("/login");
  }
};

const onUpdate = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      const token = localStorage.getItem("token");
      await updateProfile(profile.value, token);
      ElMessage.success(t('profile.updateSuccess'));
    } catch (error) {
      ElMessage.error(error.response?.data?.message || t('profile.updateFailed'));
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
