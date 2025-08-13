<template>
  <div>
    <el-form :model="form" ref="formRef" label-width="100px" @submit.prevent="onSubmit">
      <el-form-item label="店铺名称" prop="store_name" :rules="[{ required: true, message: '请输入店铺名称', trigger: 'blur' }]">
        <el-input v-model="form.store_name" />
      </el-form-item>
      <el-form-item label="联系人" prop="contact_name" :rules="[{ required: true, message: '请输入联系人', trigger: 'blur' }]">
        <el-input v-model="form.contact_name" />
      </el-form-item>
      <el-form-item label="电话" prop="phone" :rules="[{ required: true, message: '请输入电话', trigger: 'blur' }]">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email" :rules="[{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }]">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" />
      </el-form-item>
      <el-form-item label="营业执照" prop="business_license">
        <el-input v-model="form.business_license" />
      </el-form-item>
      <el-form-item label="备注" prop="notes">
        <el-input type="textarea" v-model="form.notes" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="loading">提交申请</el-button>
      </el-form-item>
    </el-form>

    <el-divider></el-divider>

    <div v-if="application">
      <h3>当前申请状态</h3>
      <p>申请ID: {{ application.application_id }}</p>
      <p>状态: {{ application.status }}</p>
      <p>管理员: {{ application.admin_id || '无' }}</p>
      <p>申请时间: {{ application.created_at }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

const formRef = ref(null);
const loading = ref(false);
const form = reactive({
  store_name: '',
  contact_name: '',
  phone: '',
  email: '',
  address: '',
  business_license: '',
  notes: '',
});
const application = ref(null);

// 获取当前申请状态
async function fetchApplication() {
  try {
    const res = await axios.get('/api/merchants/apply/me');  // 你的后端接口地址
    application.value = res.data;
  } catch (error) {
    application.value = null;
  }
}

async function onSubmit() {
  if (!formRef.value) return;
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    try {
      await axios.post('/api/merchants/apply', form);
      ElMessage.success('申请提交成功');
      fetchApplication();
    } catch (error) {
      ElMessage.error(error.response?.data?.message || '申请提交失败');
    } finally {
      loading.value = false;
    }
  });
}

onMounted(() => {
  fetchApplication();
});
</script>
