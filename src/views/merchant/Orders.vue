<template>
  <div class="orders">
    <h2>订单管理</h2>

    <el-form :inline="true" class="filter-form" @submit.prevent="fetchOrders">
      <el-form-item label="订单状态">
        <el-select v-model="filters.status" placeholder="请选择状态" clearable style="width: 180px;">
          <el-option label="全部" value="" />
          <el-option label="待发货" value="待发货" />
          <el-option label="已发货" value="已发货" />
          <el-option label="已完成" value="已完成" />
          <el-option label="已取消" value="已取消" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序">
        <el-select v-model="filters.sortOrder" placeholder="排序方式" style="width: 180px;">
          <el-option label="最新订单" value="desc" />
          <el-option label="最早订单" value="asc" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchOrders">筛选</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="orders" style="width: 100%" v-loading="loading" @row-click="showOrderDetail">
      <el-table-column prop="order_id" label="订单ID" width="120" />
      <el-table-column prop="product_name" label="商品" />
      <el-table-column prop="buyer_name" label="买家" width="150" />
      <el-table-column prop="quantity" label="数量" width="80" />
      <el-table-column prop="total_price" label="总价" width="100" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column label="操作" width="140">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click.stop="openUpdateStatusDialog(row)">更新物流</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalOrders"
      :page-size="pageSize"
      :current-page="page"
      @current-change="pageChange"
      style="margin-top: 20px;"
    />

    <!-- 订单物流状态更新弹窗 -->
    <el-dialog
      title="更新订单物流状态"
      :visible.sync="updateStatusDialogVisible"
      width="500px"
    >
      <el-form ref="statusForm" :model="statusForm" label-width="120px">
        <el-form-item label="物流状态">
          <el-select v-model="statusForm.shipping_status" placeholder="选择状态">
            <el-option label="待发货" value="待发货" />
            <el-option label="已发货" value="已发货" />
            <el-option label="运输中" value="运输中" />
            <el-option label="已签收" value="已签收" />
          </el-select>
        </el-form-item>
        <el-form-item label="快递公司">
          <el-input v-model="statusForm.shipping_company" placeholder="填写快递公司" />
        </el-form-item>
        <el-form-item label="运单号">
          <el-input v-model="statusForm.tracking_number" placeholder="填写运单号" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="updateStatusDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUpdateStatus">提交</el-button>
      </template>
    </el-dialog>

    <!-- 订单详情弹窗 -->
    <el-dialog
      title="订单详情"
      :visible.sync="orderDetailDialogVisible"
      width="600px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="订单ID">{{ selectedOrder.order_id }}</el-descriptions-item>
        <el-descriptions-item label="商品名称">{{ selectedOrder.product_name }}</el-descriptions-item>
        <el-descriptions-item label="买家">{{ selectedOrder.buyer_name }}</el-descriptions-item>
        <el-descriptions-item label="数量">{{ selectedOrder.quantity }}</el-descriptions-item>
        <el-descriptions-item label="总价">{{ selectedOrder.total_price }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">{{ selectedOrder.status }}</el-descriptions-item>
        <el-descriptions-item label="物流状态">{{ selectedOrder.shipping_status || '无' }}</el-descriptions-item>
        <el-descriptions-item label="快递公司">{{ selectedOrder.shipping_company || '无' }}</el-descriptions-item>
        <el-descriptions-item label="运单号">{{ selectedOrder.tracking_number || '无' }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ selectedOrder.created_at }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="orderDetailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const orders = ref([]);
const totalOrders = ref(0);
const page = ref(1);
const pageSize = 10;
const loading = ref(false);

const filters = ref({
  status: '',
  sortOrder: 'desc',
});

const updateStatusDialogVisible = ref(false);
const orderDetailDialogVisible = ref(false);
const selectedOrder = ref({});

const statusForm = ref({
  shipping_status: '',
  shipping_company: '',
  tracking_number: '',
});

const fetchOrders = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    const params = {
      page: page.value,
      limit: pageSize,
      status: filters.value.status,
      sortOrder: filters.value.sortOrder,
    };
    const res = await axios.get('/api/orders/seller', {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    orders.value = res.data.orders;
    // 总数从后端响应头或者接口字段获取，这里示例固定10页
    totalOrders.value = 100; 
  } catch (error) {
    ElMessage.error('获取订单失败');
  } finally {
    loading.value = false;
  }
};

const pageChange = (newPage) => {
  page.value = newPage;
  fetchOrders();
};

const openUpdateStatusDialog = (order) => {
  selectedOrder.value = order;
  statusForm.value.shipping_status = order.shipping_status || '';
  statusForm.value.shipping_company = order.shipping_company || '';
  statusForm.value.tracking_number = order.tracking_number || '';
  updateStatusDialogVisible.value = true;
};

const submitUpdateStatus = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.patch(
      `/api/orders/${selectedOrder.value.order_id}/status`,
      statusForm.value,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    ElMessage.success('更新成功');
    updateStatusDialogVisible.value = false;
    fetchOrders();
  } catch (error) {
    ElMessage.error('更新失败');
  }
};

const showOrderDetail = (order) => {
  selectedOrder.value = order;
  orderDetailDialogVisible.value = true;
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.orders {
  padding: 20px;
}

.filter-form {
  margin-bottom: 20px;
}
</style>
