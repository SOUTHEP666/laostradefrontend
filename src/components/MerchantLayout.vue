<template>
  <el-container style="height: 100vh;">
    <el-header>
      <el-menu :default-active="activePath" mode="horizontal" @select="handleSelect">
        <el-menu-item index="/merchant/dashboard">首页</el-menu-item>
        <el-menu-item index="/merchant/products">商品管理</el-menu-item>
        <el-menu-item index="/merchant/orders">订单管理</el-menu-item>
        <el-menu-item index="/merchant/reviews">评价管理</el-menu-item>
        <el-menu-item index="/merchant/profile">店铺资料</el-menu-item>
        <el-menu-item index="logout" style="float:right;">退出</el-menu-item>
      </el-menu>
    </el-header>

    <el-main>
      <!-- 如果是申请页面，直接渲染申请组件 -->
      <router-view v-if="isApplyRoute" />
      
      <!-- 不是申请页面，才根据审核状态显示提示或内容 -->
      <template v-else>
        <div v-if="auditStatus === STATUS.NO_APPLY" class="center-message">
          <p>您还未申请商家审核，请先完成申请。</p>
          <el-button type="primary" @click="goToApply">去申请</el-button>
        </div>

        <div v-else-if="auditStatus === STATUS.PENDING" class="center-message">
          <p>您的商家申请正在审核中，请耐心等待。</p>
        </div>

        <div v-else-if="auditStatus === STATUS.REJECTED" class="center-message">
          <p>您的商家审核未通过，请联系管理员或重新申请。</p>
          <el-button type="warning" @click="goToApply">重新申请</el-button>
        </div>

        <router-view v-else :isReadOnly="isReadOnly" />
      </template>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';

// 审核状态常量
const STATUS = {
  NO_APPLY: 'no_apply',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

const router = useRouter();
const route = useRoute();

const activePath = ref(route.path);
const auditStatus = ref(STATUS.PENDING);
const isReadOnly = ref(false);

// 计算当前是否是申请页面路径
const isApplyRoute = computed(() => route.path === '/merchant/apply');

watch(() => route.path, (val) => {
  activePath.value = val;
});

onMounted(async () => {
  if (route.path === '/merchant') {
    router.replace('/merchant/dashboard');
  }
  await fetchAuditStatus();
});

async function fetchAuditStatus() {
  try {
    const res = await axios.get('/api/merchants/status', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    auditStatus.value = res.data.status || STATUS.NO_APPLY;
    isReadOnly.value = auditStatus.value === STATUS.REJECTED;
  } catch (err) {
    console.error('获取审核状态失败', err);
    ElMessage.error('获取审核状态失败，请稍后重试');
    auditStatus.value = STATUS.REJECTED;
    isReadOnly.value = true;
  }
}

function goToApply() {
  router.push('/merchant/apply').catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      console.error('跳转失败:', err);
    }
  });
}

function handleSelect(index) {
  if (index === 'logout') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  } else {
    router.push(index);
  }
}
</script>

<style scoped>
.center-message {
  margin-top: 50px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}
</style>
