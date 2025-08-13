<template>
  <div class="variants">
    <h2>商品变体管理</h2>

    <el-button type="primary" @click="showAddDialog">新增变体</el-button>

    <el-table :data="variants" style="width: 100%" v-loading="loading" @row-click="selectVariant">
      <el-table-column prop="variant_id" label="变体ID" width="100" />
      <el-table-column prop="variant_sku" label="SKU" />
      <el-table-column prop="price_adjustment" label="价格调整" width="120" />
      <el-table-column prop="stock_quantity" label="库存" width="100" />
      <el-table-column label="图片" width="120">
        <template #default="{ row }">
          <img v-if="row.image_url" :src="row.image_url" alt="变体图" style="width: 80px; height: 50px; object-fit: cover;" />
          <span v-else>无图</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click.stop="editVariant(row)">编辑</el-button>
          <el-button size="small" type="danger" @click.stop="deleteVariant(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="page"
      @current-change="pageChange"
      style="margin-top: 20px;"
    />

    <!-- 新增/编辑变体弹窗 -->
    <el-dialog
      :title="isEditing ? '编辑变体' : '新增变体'"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <el-form :model="form" ref="formRef" label-width="120px" :rules="rules">
        <el-form-item label="SKU" prop="variant_sku">
          <el-input v-model="form.variant_sku" />
        </el-form-item>
        <el-form-item label="价格调整" prop="price_adjustment">
          <el-input-number v-model="form.price_adjustment" :min="0" />
        </el-form-item>
        <el-form-item label="库存" prop="stock_quantity">
          <el-input-number v-model="form.stock_quantity" :min="0" />
        </el-form-item>
        <el-form-item label="图片ID" prop="image_id">
          <el-input v-model="form.image_id" placeholder="填写已有图片ID或留空" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';

const productId = ref(null); // 你可以传入 props 或路由参数

const variants = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = 10;
const loading = ref(false);

const dialogVisible = ref(false);
const isEditing = ref(false);
const form = ref({
  variant_sku: '',
  price_adjustment: 0,
  stock_quantity: 0,
  image_id: null,
  variant_id: null,
});

const rules = {
  variant_sku: [{ required: true, message: '请输入SKU', trigger: 'blur' }],
};

const fetchVariants = async () => {
  if (!productId.value) return;
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`/api/variants/product/${productId.value}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        page: page.value,
        limit: pageSize,
      },
    });
    variants.value = res.data;
    total.value = res.data.length; // 后端需支持分页总数字段
  } catch (err) {
    ElMessage.error('获取变体失败');
  } finally {
    loading.value = false;
  }
};

const pageChange = (newPage) => {
  page.value = newPage;
  fetchVariants();
};

const showAddDialog = () => {
  isEditing.value = false;
  form.value = {
    variant_sku: '',
    price_adjustment: 0,
    stock_quantity: 0,
    image_id: null,
    variant_id: null,
  };
  dialogVisible.value = true;
};

const editVariant = (variant) => {
  isEditing.value = true;
  form.value = { ...variant };
  dialogVisible.value = true;
};

const submitForm = () => {
  const token = localStorage.getItem('token');
  if (isEditing.value) {
    axios.put(`/api/variants/${form.value.variant_id}`, form.value, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        ElMessage.success('更新成功');
        dialogVisible.value = false;
        fetchVariants();
      })
      .catch(() => ElMessage.error('更新失败'));
  } else {
    axios.post(`/api/variants/product/${productId.value}/variants`, form.value, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        ElMessage.success('新增成功');
        dialogVisible.value = false;
        fetchVariants();
      })
      .catch(() => ElMessage.error('新增失败'));
  }
};

const deleteVariant = (variant) => {
  ElMessageBox.confirm('确定删除该变体？', '提示')
    .then(() => {
      const token = localStorage.getItem('token');
      axios.delete(`/api/variants/${variant.variant_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          ElMessage.success('删除成功');
          fetchVariants();
        })
        .catch(() => ElMessage.error('删除失败'));
    })
    .catch(() => { /* 取消 */ });
};

onMounted(() => {
  // 如果productId是通过props或路由传入，这里要赋值
  // productId.value = ...
  fetchVariants();
});
</script>

<style scoped>
.variants {
  padding: 20px;
}
</style>
