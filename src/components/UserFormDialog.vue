<template>
  <el-dialog :title="isEdit ? '编辑用户' : '新增用户'" :visible.sync="visible" width="480px">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" size="small">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" autocomplete="off" :disabled="isEdit" />
      </el-form-item>

      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" autocomplete="off" />
      </el-form-item>

      <el-form-item label="角色" prop="role">
        <el-select v-model="form.role" :disabled="isEdit">
          <el-option label="二级管理员" value="admin" />
          <el-option label="商家" value="merchant" />
          <el-option label="客户" value="customer" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="!isEdit" label="密码" prop="password">
        <el-input v-model="form.password" type="password" autocomplete="new-password" />
      </el-form-item>

      <el-form-item v-if="role === 'merchant'" label="店铺状态" prop="store_open">
        <el-switch v-model="form.store_open" active-text="开业" inactive-text="关闭" />
      </el-form-item>

      <el-form-item label="是否启用" prop="is_active">
        <el-switch v-model="form.is_active" active-text="启用" inactive-text="禁用" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, watch, ref, toRefs } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  visible: Boolean,
  userData: Object,
  role: {
    type: String,
    default: 'admin', // admin, merchant, customer
  },
});

const emit = defineEmits(['update:visible', 'submit-success']);

const formRef = ref(null);

const form = reactive({
  id: null,
  username: '',
  name: '',
  email: '',
  role: props.role,
  password: '',
  store_open: false,
  is_active: true,
});

const isEdit = ref(false);

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3到20个字符', trigger: 'blur' },
  ],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  password: [
    {
      required: !isEdit.value,
      message: '请输入密码',
      trigger: 'blur',
    },
  ],
};

watch(
  () => props.userData,
  (val) => {
    if (val) {
      Object.assign(form, val);
      isEdit.value = true;
      form.password = '';
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

watch(
  () => props.role,
  (val) => {
    form.role = val;
  }
);

function resetForm() {
  form.id = null;
  form.username = '';
  form.name = '';
  form.email = '';
  form.role = props.role;
  form.password = '';
  form.store_open = false;
  form.is_active = true;
  isEdit.value = false;
  formRef.value?.clearValidate();
}

function handleCancel() {
  emit('update:visible', false);
}

function handleSubmit() {
  formRef.value.validate((valid) => {
    if (!valid) return;
    // 提交数据，带上 isEdit 标志
    emit('submit-success', { ...form, isEdit: isEdit.value });
  });
}
</script>
