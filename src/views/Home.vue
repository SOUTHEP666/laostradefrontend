<template>
  <div class="home-container">
    <!-- 广告轮播 -->
    <el-carousel height="300px" trigger="click">
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <img :src="item" class="banner-image" />
      </el-carousel-item>
    </el-carousel>

    <!-- 搜索与分类 -->
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索商品..."
        class="search-input"
        clearable
      />
      <!-- 这里搜索按钮可以保留，也可以去掉 -->
      <el-button type="primary" icon="el-icon-search" @click="fetchAllProducts">
        搜索
      </el-button>
      <el-upload
        class="upload-image"
        :show-file-list="false"
        :before-upload="handleImageSearch"
      >
        <el-button type="success" icon="el-icon-camera">图像识别</el-button>
      </el-upload>
    </div>

    <div class="categories">
      <el-tag
        v-for="category in categories"
        :key="category.id"
        @click="filterByCategory(category.id)"
        :type="selectedCategory === category.id ? 'success' : 'info'"
        class="category-tag"
      >
        {{ category.name }}
      </el-tag>
    </div>

    <!-- 商品列表 -->
    <el-row :gutter="20" class="product-list">
      <el-col
        :xs="12"
        :sm="12"
        :md="6"
        :lg="6"
        v-for="product in products"
        :key="product.id"
      >
        <ProductCard :product="product" />
      </el-col>
    </el-row>

    <!-- 推荐商品 -->
    <h3 class="recommend-title">猜你喜欢</h3>
    <el-row :gutter="20" class="product-list">
      <el-col
        :xs="12"
        :sm="12"
        :md="6"
        :lg="6"
        v-for="product in recommended"
        :key="product.id"
      >
        <ProductCard :product="product" />
      </el-col>
    </el-row>

    <!-- 底部 -->
    <FooterBar />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { fetchProducts, uploadAndSearchByImage } from "@/api/products";
import { fetchCategories } from "@/api/categories";
import ProductCard from "@/components/ProductCard.vue";
import FooterBar from "@/components/FooterBar.vue";

const products = ref([]);
const categories = ref([]);
const recommended = ref([]);
const searchKeyword = ref("");
const selectedCategory = ref(null);

// 广告图轮播（假数据）
const banners = ["/ads/ad1.jpg", "/ads/ad2.jpg", "/ads/ad3.jpg"];

// 获取全部商品
const fetchAllProducts = async () => {
  const params = {};
  if (searchKeyword.value) params.keyword = searchKeyword.value;
  if (selectedCategory.value) params.category_id = selectedCategory.value;

  try {
    const res = await fetchProducts(params);
    const data = res.data || [];

    products.value = data.map((item) => ({
      ...item,
      firstImage: Array.isArray(item.image_url)
        ? item.image_url[0]
        : typeof item.image_url === "string" && item.image_url.includes(",")
        ? item.image_url.split(",")[0]
        : item.image_url || "/default.jpg",
    }));

    recommended.value = products.value.slice(0, 4);
  } catch (error) {
    console.error("获取商品失败:", error);
  }
};

// 监听关键词变化，自动搜索
watch(
  searchKeyword,
  () => {
    fetchAllProducts();
  },
  { immediate: false }
);

// 图像搜索功能
const handleImageSearch = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await uploadAndSearchByImage(formData);
    const data = res.data || [];

    products.value = data.map((item) => ({
      ...item,
      firstImage: Array.isArray(item.image_url)
        ? item.image_url[0]
        : typeof item.image_url === "string" && item.image_url.includes(",")
        ? item.image_url.split(",")[0]
        : item.image_url || "/default.jpg",
    }));

    recommended.value = products.value.slice(0, 4);
  } catch (error) {
    console.error("图像搜索失败:", error);
  }

  return false; // 阻止默认上传行为
};

// 分类筛选
const filterByCategory = (id) => {
  selectedCategory.value = id;
  fetchAllProducts();
};

// 页面加载时获取分类 & 商品
onMounted(async () => {
  try {
    const res = await fetchCategories();
    categories.value = res.data || [];
    fetchAllProducts();
  } catch (error) {
    console.error("获取分类失败:", error);
  }
});
</script>

<style scoped>
.home-container {
  padding: 20px;
}
.banner-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}
.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  flex-wrap: wrap;
}
.search-input {
  width: 300px;
  margin-right: 10px;
  min-width: 200px;
}
.upload-image {
  margin-left: 10px;
}
.categories {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.category-tag {
  cursor: pointer;
}
.product-list {
  margin-bottom: 40px;
}
.recommend-title {
  margin: 30px 0 10px;
}
@media (max-width: 600px) {
  .search-bar {
    justify-content: center;
  }
  .search-input {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }
  .upload-image {
    margin-left: 0;
  }
}
</style>
