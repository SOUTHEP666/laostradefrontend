<!-- 文件：src/components/ProductCard.vue -->
<template>
  <el-card
    :body-style="{ padding: '10px' }"
    shadow="hover"
    class="product-card"
    @click="goToDetail"
  >
    <img :src="product.firstImage" class="product-image" />
    <div class="product-info">
      <h4 class="product-title">{{ product.title }}</h4>
      <p class="product-price">₭ {{ product.price }}</p>
    </div>
  </el-card>
</template>

<script setup>
import { useRouter } from 'vue-router';
const props = defineProps({ product: Object });

const router = useRouter();

const goToDetail = () => {
  router.push(`/product/${props.product.id}`);
};
</script>

<style scoped>
.product-card {
  cursor: pointer;
  transition: 0.3s;
}
.product-card:hover {
  transform: translateY(-5px);
}
.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.product-title {
  margin: 8px 0;
  font-size: 16px;
}
.product-price {
  color: #e91e63;
  font-weight: bold;
}
</style>
