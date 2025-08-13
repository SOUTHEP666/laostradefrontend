<template>
  <div class="buyer-product-detail" style="max-width: 800px; margin: 30px auto; background: #fff; padding: 24px; border-radius: 8px;">
    <el-button type="text" @click="goBack" style="margin-bottom: 20px;">
      ← 返回商品列表
    </el-button>

    <el-card v-if="product" shadow="hover">
      <h2>{{ product.product_name }}</h2>
      <p style="color: #666;">{{ product.product_description || "暂无商品描述" }}</p>

      <div style="display: flex; gap: 24px; margin-top: 20px;">
        <div style="flex: 1;">
          <p><strong>价格：</strong>￥{{ Number(product.price).toFixed(2) }}</p>
          <p><strong>库存：</strong>{{ product.stock_quantity }}</p>
          <hr />
          <h3>商家信息</h3>
          <p><strong>店铺名：</strong>{{ product.store_name || "无" }}</p>
          <p><strong>商家描述：</strong> {{ product.merchant_description || "暂无描述" }}</p>
          <p><strong>商家状态：</strong> {{ product.merchant_status === 1 ? "正常" : "禁用" }}</p>
          <hr />
          <h4>联系人信息</h4>
          <p><strong>用户名：</strong> {{ product.username || "无" }}</p>
          <p><strong>邮箱：</strong> {{ product.email || "无" }}</p>
        </div>
      </div>
    </el-card>

    <el-empty v-else description="商品不存在或加载失败"></el-empty>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "@/api/request";

const router = useRouter();
const route = useRoute();

const product = ref(null);

async function fetchProductDetail() {
  const id = route.params.id;
  try {
    const res = await request.get(`/products/${id}`);
    product.value = res;
  } catch (error) {
    console.error("获取商品详情失败", error);
    product.value = null;
  }
}

function goBack() {
  router.back();
}

onMounted(() => {
  fetchProductDetail();
});
</script>

<style scoped>
.buyer-product-detail {
  /* 自定义样式 */
}
</style>
