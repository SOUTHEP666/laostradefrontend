<template>
  <div class="product-home">
    <!-- 搜索栏 + 分类 -->
    <div class="search-filter">
      <el-input
        v-model="keyword"
        placeholder="搜索商品"
        clearable
        @clear="handleClear"
        @input="searchWithDebounce"
        class="search-input"
      />
      <el-select
        v-model="category"
        placeholder="选择分类"
        clearable
        @change="searchWithDebounce"
        class="category-select"
      >
        <el-option
          v-for="item in categories"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>

    <!-- 商品卡片网格 -->
    <el-row :gutter="12" class="product-grid">
      <el-col
        v-for="product in products"
        :key="product.product_id"
        :xs="12"
        :sm="8"
        :md="6"
        :lg="4"
      >
        <el-card
          shadow="hover"
          class="product-card"
          @click.native="handleRowClick(product)"
        >
          <img
            class="product-image"
            :src="product.image_url || 'https://via.placeholder.com/150'"
            alt="商品图片"
          />
          <div class="product-info">
            <h4 class="product-name" :title="product.product_name">{{ product.product_name }}</h4>
            <div class="product-price">￥{{ Number(product.price).toFixed(2) }}</div>
            <div class="product-stock">库存：{{ product.stock_quantity }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next, jumper"
      :current-page="page"
      :page-size="limit"
      :total="total"
      @current-change="handlePageChange"
      class="pagination"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import request from "@/api/request";

const router = useRouter();

const page = ref(1);
const limit = ref(24);
const total = ref(0);

const keyword = ref("");
const category = ref("");

const categories = ["电子产品", "服装", "食品", "书籍", "家居"];

const products = ref([]);

let debounceTimer = null;

async function fetchProducts() {
  try {
    const res = await request.get("/products", {
      params: {
        page: page.value,
        limit: limit.value,
        keyword: keyword.value.trim(),
        category: category.value,
      },
    });
    products.value = res.data;
    total.value = res.total;
    page.value = res.page;
    limit.value = res.limit;
  } catch (err) {
    console.error("获取商品列表失败", err);
  }
}

function handlePageChange(newPage) {
  page.value = newPage;
  fetchProducts();
}

function searchWithDebounce() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    page.value = 1;
    fetchProducts();
  }, 300);
}

function handleClear() {
  page.value = 1;
  fetchProducts();
}

function handleRowClick(product) {
  router.push(`/buyer/product/${product.product_id}`);
}

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.product-home {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 12px 60px;
}

.search-filter {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1 1 300px;
  min-width: 250px;
}

.category-select {
  width: 180px;
}

.product-grid {
  margin-bottom: 20px;
}

.product-card {
  cursor: pointer;
  padding: 10px;
  text-align: center;
  transition: box-shadow 0.3s ease;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.product-image {
  width: 100%;
  height: 150px;
  object-fit: contain;
  margin-bottom: 8px;
  border-radius: 4px;
  background: #f5f5f5;
}

.product-info {
  text-align: left;
  padding: 0 6px;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 6px;
  height: 38px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  font-size: 16px;
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 4px;
}

.product-stock {
  font-size: 12px;
  color: #999;
}
.pagination {
  text-align: center;
}
</style>
