<template>
  <div class="attributes">
    <h2>属性管理</h2>

    <!-- 管理员部分：管理全局属性 -->
    <div v-if="isAdmin">
      <el-form :inline="true" @submit.prevent="handleAddAttribute" style="margin-bottom: 1rem;">
        <el-form-item label="新增属性">
          <el-input v-model="newAttributeName" placeholder="属性名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAddAttribute">添加</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="attributes" style="margin-bottom: 2rem;">
        <el-table-column prop="attribute_id" label="ID" width="80" />
        <el-table-column prop="attribute_name" label="属性名" />
        <el-table-column label="属性值">
          <template #default="{ row }">
            <el-button size="mini" @click="showValues(row)">查看值</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        :title="`属性值 - ${currentAttribute.attribute_name || ''}`"
        :visible.sync="valuesDialogVisible"
      >
        <el-form :inline="true" @submit.prevent="handleAddValue" style="margin-bottom: 1rem;">
          <el-form-item label="新增值">
            <el-input v-model="newValue" placeholder="属性值" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAddValue">添加</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="attributeValues" size="small">
          <el-table-column prop="value_id" label="ID" width="80" />
          <el-table-column prop="value" label="属性值" />
        </el-table>
      </el-dialog>
    </div>

    <!-- 商家部分：绑定商品属性 -->
    <div v-if="isMerchant">
      <el-form :inline="true" @submit.prevent="handleBindAttribute" style="margin-bottom: 1rem;">
        <el-form-item label="选择属性">
          <el-select v-model="bindForm.attribute_id" placeholder="请选择属性" style="width: 200px;">
            <el-option
              v-for="attr in attributes"
              :key="attr.attribute_id"
              :label="attr.attribute_name"
              :value="attr.attribute_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择值">
          <el-select v-model="bindForm.value_id" placeholder="请选择属性值" style="width: 200px;">
            <el-option
              v-for="val in attributeValues"
              :key="val.value_id"
              :label="val.value"
              :value="val.value_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleBindAttribute">绑定</el-button>
        </el-form-item>
      </el-form>

      <h3>商品已绑定属性</h3>
      <el-table :data="productAttributes" size="small">
        <el-table-column prop="attribute_name" label="属性" />
        <el-table-column prop="value" label="值" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import {
  fetchAttributes,
  addAttribute,
  fetchAttributeValues,
  addAttributeValue,
  bindProductAttribute,
  fetchProductAttributes,
} from '@/api/attributes.js';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';

const route = useRoute();
const productId = route.params.id || null;

const user = JSON.parse(localStorage.getItem('user') || '{}');
const isAdmin = user.role === 'admin';
const isMerchant = user.role === 'merchant';

const attributes = ref([]);
const attributeValues = ref([]);
const productAttributes = ref([]);
const currentAttribute = ref({});

const newAttributeName = ref('');
const newValue = ref('');

const valuesDialogVisible = ref(false);

const bindForm = ref({
  attribute_id: null,
  value_id: null,
});

const loadAttributes = async () => {
  try {
    const res = await fetchAttributes();
    attributes.value = res.data;
  } catch {
    ElMessage.error('加载属性失败');
  }
};

const loadAttributeValues = async (attributeId) => {
  try {
    const res = await fetchAttributeValues(attributeId);
    attributeValues.value = res.data;
  } catch {
    ElMessage.error('加载属性值失败');
  }
};

const loadProductAttributes = async () => {
  if (!productId) return;
  try {
    const res = await fetchProductAttributes(productId);
    productAttributes.value = res.data;
  } catch {
    ElMessage.error('加载商品绑定属性失败');
  }
};

const handleAddAttribute = async () => {
  if (!newAttributeName.value) {
    ElMessage.warning('请输入属性名');
    return;
  }
  try {
    await addAttribute(newAttributeName.value);
    ElMessage.success('添加成功');
    newAttributeName.value = '';
    loadAttributes();
  } catch {
    ElMessage.error('添加属性失败');
  }
};

const showValues = (attribute) => {
  currentAttribute.value = attribute;
  loadAttributeValues(attribute.attribute_id);
  valuesDialogVisible.value = true;
};

const handleAddValue = async () => {
  if (!newValue.value || !currentAttribute.value.attribute_id) {
    ElMessage.warning('请选择属性并输入值');
    return;
  }
  try {
    await addAttributeValue(currentAttribute.value.attribute_id, newValue.value);
    ElMessage.success('添加成功');
    newValue.value = '';
    loadAttributeValues(currentAttribute.value.attribute_id);
  } catch {
    ElMessage.error('添加属性值失败');
  }
};

const handleBindAttribute = async () => {
  if (!bindForm.value.attribute_id || !bindForm.value.value_id) {
    ElMessage.warning('请选择属性和属性值');
    return;
  }
  try {
    await bindProductAttribute(productId, bindForm.value.attribute_id, bindForm.value.value_id);
    ElMessage.success('绑定成功');
    loadProductAttributes();
  } catch {
    ElMessage.error('绑定失败');
  }
};

onMounted(() => {
  loadAttributes();
  if (isMerchant) {
    loadProductAttributes();
  }
});
</script>

<style scoped>
.attributes {
  padding: 20px;
}
</style>
