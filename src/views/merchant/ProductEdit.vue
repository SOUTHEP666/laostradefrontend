<template>
  <el-form :model="form" ref="formRef" :rules="rules" label-width="120px" style="max-width: 600px;">
    <el-form-item label="商品名" prop="product_name">
      <el-input v-model="form.product_name" />
    </el-form-item>
    <el-form-item label="价格" prop="price">
      <el-input-number v-model="form.price" :min="0" />
    </el-form-item>
    <el-form-item label="库存" prop="stock_quantity">
      <el-input-number v-model="form.stock_quantity" :min="0" />
    </el-form-item>
    <el-form-item label="是否上架" prop="is_active">
      <el-switch v-model="form.is_active" active-text="上架" inactive-text="下架" />
    </el-form-item>
    <el-form-item label="商品描述" prop="product_description">
      <el-input type="textarea" v-model="form.product_description" rows="4" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm" :loading="loading">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const id = route.params.id || null;

const form = reactive({
  product_name: '',
  price: 0,
  stock_quantity: 0,
  is_active: true,
  product_description: '',
});

const loading = ref(false);

const rules = {
  product_name: [{ required: true, message: '请输入商品名', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  stock_quantity: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
};

const formRef = ref(null);

// 读取商品详情（编辑时）
async function fetchProduct() {
  if (!id) return;
  loading.value = true;
  try {
    const res = await axios.get(`/api/merchant/products/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    // 只赋值需要的字段，防止覆盖form的默认字段
    const data = res.data;
    form.product_name = data.product_name || '';
    form.price = data.price || 0;
    form.stock_quantity = data.stock_quantity || 0;
    form.is_active = data.is_active != null ? data.is_active : true;
    form.product_description = data.product_description || '';
  } catch (err) {
    alert('加载商品失败');
  } finally {
    loading.value = false;
  }
}

// 提交表单，新增或编辑
async function submitForm() {
  try {
    await formRef.value.validate();
  } catch (err) {
    // 校验失败，阻止提交
    return;
  }

  loading.value = true;
  try {
    if (id) {
      await axios.put(`/api/merchant/products/${id}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } else {
      await axios.post('/api/merchant/products', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    }
    router.push('/merchant/products');
  } catch (err) {
    alert('保存失败');
  } finally {
    loading.value = false;
  }
}

// 取消返回列表页
function cancel() {
  router.push('/merchant/products');
}

onMounted(() => {
  fetchProduct();
});
</script>
