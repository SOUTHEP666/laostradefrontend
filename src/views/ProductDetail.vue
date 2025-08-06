<template>
  <div class="product-detail" v-if="product">
    <el-row :gutter="20">
      <!-- 左侧图片区域 -->
      <el-col :span="10">
        <div class="image-gallery">
          <el-image
            v-for="(img, index) in imageList"
            :key="index"
            :src="img"
            :preview-src-list="imageList"
            fit="cover"
            class="gallery-image"
          />
        </div>
      </el-col>

      <!-- 右侧商品信息 -->
      <el-col :span="14">
        <h2>{{ product.title }}</h2>
        <p><strong>品牌：</strong>{{ product.brand }}</p>
        <p><strong>型号：</strong>{{ product.model }}</p>
        <p>
          <strong>价格：</strong>
          <span style="color: red; font-size: 20px;">₭ {{ product.price }}</span>
        </p>
        <p><strong>库存：</strong>{{ product.stock || '请联系商家' }}</p>
        <p><strong>描述：</strong>{{ product.description }}</p>
        <el-button type="primary" size="large">加入购物车</el-button>
      </el-col>
    </el-row>
  </div>

  <!-- 加载骨架屏 -->
  <div v-else class="loading">
    <el-skeleton rows="5" animated />
  </div>
</template>

<script>
import { getProductById } from '@/api/products';

export default {
  name: 'ProductDetail',
  data() {
    return {
      product: null,
      imageList: [],
    };
  },
  async created() {
    const id = this.$route.params.id;
    try {
      const res = await getProductById(id);
      this.product = res.data;

      // 解析 image_url 成多个图片链接
      const imgRaw = this.product.image_url;
      if (Array.isArray(imgRaw)) {
        this.imageList = imgRaw;
      } else if (typeof imgRaw === 'string') {
        this.imageList = imgRaw.includes(',')
          ? imgRaw.split(',').map(img => img.trim())
          : [imgRaw];
      } else {
        this.imageList = ['/default.jpg'];
      }
    } catch (error) {
      console.error('获取商品详情失败', error);
    }
  },
};
</script>

<style scoped>
.product-detail {
  padding: 20px;
}
.image-gallery {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.gallery-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
}
</style>
