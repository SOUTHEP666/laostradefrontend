<template>
  <el-dialog :title="isEdit ? '编辑商品' : '新增商品'" :visible.sync="visible" width="500px">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" size="small">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>

      <el-form-item label="商家ID" prop="merchant_id">
        <el-input v-model="form.merchant_id" autocomplete="off" />
      </el-form-item>

      <el-form-item label="价格" prop="price">
        <el-input-number v-model="form.price" :min="0" :step="0.01" />
      </el-form-item>

      <el-form-item label="库存" prop="stock">
        <el-input-number v-model="form.stock" :min="0" />
      </el-form-item>

      <el-form-item label="是否上架" prop="is_active">
        <el-switch v-model="form.is_active" active-text="上架" inactive-text="下架" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  visible: Boolean,
  productData: Object,
});

const emit = defineEmits(['update:visible', 'submit-success']);

const formRef = ref(null);

const form = reactive({
  id: null,
  name: '',
  merchant_id: '',
  price: 0,
  stock: 0,
  is_active: true,
});

const isEdit = ref(false);

const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  merchant_id: [{ required: true, message: '请输入商家ID', trigger: 'blur' }],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    {
      type: 'number',
      min: 0,
      message: '价格必须大于等于0',
      trigger: 'blur',
    },
  ],
  stock: [
    { required: true, message: '请输入库存', trigger: 'blur' },
    {
      type: 'number',
      min: 0,
      message: '库存必须大于等于0',
      trigger: 'blur',
    },
  ],
};

watch(
  () => props.productData,
  (val) => {
    if (val) {
      Object.assign(form, val);
      isEdit.value = true;
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

function resetForm() {
  form.id = null;
  form.name = '';
  form.merchant_id = '';
  form.price = 0;
  form.stock = 0;
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
    emit('submit-success', { ...form, isEdit: isEdit.value });
  });
}
</script>
