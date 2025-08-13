<template>
  <div class="product-list">
    <el-input
      v-model="keyword"
      placeholder="搜索商品"
      clearable
      @clear="handleSearch"
      @keyup.enter.native="handleSearch"
      style="width: 300px;"
    />

    <el-select
      v-model="category"
      placeholder="选择分类"
      clearable
      style="width: 200px; margin-left: 20px;"
      @change="handleSearch"
    >
      <el-option
        v-for="item in categories"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>

    <el-table
      :data="products"
      style="width: 100%; margin-top: 20px;"
      @row-click="handleRowClick"
      highlight-current-row
      empty-text="暂无商品"
    >
      <el-table-column prop="product_name" label="商品名称" />
      <el-table-column label="价格" width="120">
        <template #default="{ row }">
          ￥{{ Number(row.price).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="stock_quantity" label="库存" width="80" />
      <el-table-column label="商家" width="200">
        <template #default="{ row }">
          {{ row.store_name || "无" }}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 20px; text-align: right;"
      background
      :current-page="page"
      :page-size="limit"
      :total="total"
      layout="prev, pager, next, jumper"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import request from "@/api/request";

const router = useRouter();

const page = ref(1);
const limit = ref(12);
const total = ref(0);

const keyword = ref("");
const category = ref("");

const categories = ["电子产品", "服装", "食品", "书籍", "家居"];

const products = ref([]);

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

function handleSearch() {
  page.value = 1;
  fetchProducts();
}

function handleRowClick(row) {
  router.push(`/buyer/product/${row.product_id}`);
}

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.product-list {
  background-color: #fff;
  padding: 20px;
  border-radius: 6px;
  max-width: 900px;
  margin: auto;
}
</style>
