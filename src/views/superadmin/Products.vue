<template>
  <div>
    <h2>商品管理</h2>
    <el-input v-model="keyword" placeholder="搜索商品名称" style="width: 300px; margin-bottom: 10px" clearable @clear="fetchProducts" @keyup.enter="fetchProducts" />
    <el-table
      :data="products"
      style="width: 100%"
      v-loading="loading"
      :row-key="row => row.product_id"
    >
      <el-table-column prop="product_id" label="ID" width="80" />
      <el-table-column prop="product_name" label="商品名称" />
      <el-table-column prop="price" label="价格" width="100" />
      <el-table-column prop="stock_quantity" label="库存" width="100" />
      <el-table-column prop="is_active" label="状态" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.is_active"
            @change="toggleStatus(row)"
            active-text="启用"
            inactive-text="禁用"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="editProduct(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteProduct(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      layout="prev, pager, next"
      @current-change="pageChange"
      style="margin-top: 15px;"
    />

    <!-- 编辑商品对话框简化 -->
    <el-dialog title="编辑商品" v-model:visible="showEditDialog" width="600px">
      <el-form :model="form" label-width="120px">
        <el-form-item label="商品名称"><el-input v-model="form.product_name" /></el-form-item>
        <el-form-item label="价格"><el-input v-model.number="form.price" type="number" /></el-form-item>
        <el-form-item label="库存"><el-input v-model.number="form.stock_quantity" type="number" /></el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.is_active" active-text="启用" inactive-text="禁用" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';

const products = ref([]);
const keyword = ref('');
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const loading = ref(false);

const showEditDialog = ref(false);
const form = reactive({
  product_id: null,
  product_name: '',
  price: 0,
  stock_quantity: 0,
  is_active: true,
});

const fetchProducts = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/api/merchant/products', {
      params: {
        page: page.value,
        limit: limit.value,
        keyword: keyword.value,
      },
    });
    products.value = res.data.data;
    total.value = res.data.total;
  } catch (err) {
    console.error('获取商品列表失败', err);
  } finally {
    loading.value = false;
  }
};

const pageChange = (newPage) => {
  page.value = newPage;
  fetchProducts();
};

const editProduct = (row) => {
  form.product_id = row.product_id;
  form.product_name = row.product_name;
  form.price = row.price;
  form.stock_quantity = row.stock_quantity;
  form.is_active = row.is_active;
  showEditDialog.value = true;
};

const submitEdit = async () => {
  try {
    await axios.put(`/api/merchant/products/${form.product_id}`, {
      product_name: form.product_name,
      price: form.price,
      stock_quantity: form.stock_quantity,
      is_active: form.is_active,
    });
    showEditDialog.value = false;
    fetchProducts();
  } catch (err) {
    console.error('修改商品失败', err);
  }
};

const deleteProduct = async (row) => {
  try {
    await axios.delete(`/api/merchant/products/${row.product_id}`);
    fetchProducts();
  } catch (err) {
    console.error('删除商品失败', err);
  }
};

onMounted(() => {
  fetchProducts();
});
</script>
