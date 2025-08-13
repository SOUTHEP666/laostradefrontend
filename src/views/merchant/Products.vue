<template>
  <div>
    <el-input
      v-model="keyword"
      placeholder="搜索商品"
      clearable
      @clear="onClear"
      @input="fetchProductsDebounced"
      style="width: 300px; margin-bottom: 10px;"
    />
    <el-button type="primary" @click="goAdd" style="margin-left: 10px;">
      新增商品
    </el-button>

    <el-table :data="products" style="width: 100%;" :loading="loading">
      <el-table-column prop="product_name" label="商品名" />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="stock_quantity" label="库存" />
      <el-table-column label="是否上架">
        <template #default="{ row }">
          <el-tag :type="row.is_active ? 'success' : 'info'">
            {{ row.is_active ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="320">
        <template #default="{ row }">
          <el-button type="text" @click="goEdit(row.product_id)">编辑</el-button>
          <el-button type="text" @click="goVariants(row.product_id)">变体</el-button>
          <el-button type="text" @click="goAttributes(row.product_id)">属性</el-button>
          <el-button type="text" @click="goImages(row.product_id)">图片</el-button>
          <el-button type="danger" @click="deleteProduct(row.product_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="page"
      :page-size="limit"
      :total="total"
      layout="total, prev, pager, next, jumper"
      @current-change="onPageChange"
      style="margin-top: 10px;"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import _ from "lodash";

const router = useRouter();

const products = ref([]);
const total = ref(0);
const page = ref(1);
const limit = ref(10);
const keyword = ref("");
const loading = ref(false);

// 获取商品列表
const fetchProducts = async () => {
  loading.value = true;
  try {
    const res = await axios.get("/api/merchant/products", {
      params: {
        page: page.value,
        limit: limit.value,
        keyword: keyword.value,
      },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    products.value = res.data.data || [];
    total.value = res.data.total || 0;
  } catch (err) {
    console.error("获取商品失败", err);
  } finally {
    loading.value = false;
  }
};

// 输入防抖，减少请求频率
const fetchProductsDebounced = _.debounce(fetchProducts, 300);

// 清除搜索关键字时触发
function onClear() {
  page.value = 1; // 重置页码
  fetchProducts();
}

// 分页切换时触发
function onPageChange(newPage) {
  page.value = newPage;
  fetchProducts();
}

// 跳转新增商品页
function goAdd() {
  router.push("/merchant/products/new");
}

// 跳转编辑商品页
function goEdit(id) {
  router.push(`/merchant/products/${id}/edit`);
}

// 跳转商品变体页
function goVariants(id) {
  router.push(`/merchant/products/${id}/variants`);
}

// 跳转商品属性页
function goAttributes(id) {
  router.push(`/merchant/products/${id}/attributes`);
}

// 跳转商品图片页
function goImages(id) {
  router.push(`/merchant/products/${id}/images`);
}

// 删除商品
async function deleteProduct(id) {
  if (!confirm("确认删除该商品吗？")) return;
  try {
    await axios.delete(`/api/merchant/products/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    // 删除后刷新列表，注意页码边界处理可优化
    fetchProducts();
  } catch (err) {
    alert("删除失败");
  }
}

onMounted(() => {
  fetchProducts();
});
</script>
