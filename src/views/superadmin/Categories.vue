<template>
  <div>
    <h2>分类管理</h2>
    <el-button type="primary" @click="showAddDialog = true" style="margin-bottom: 10px;">新增分类</el-button>

    <el-tree
      :data="categories"
      node-key="category_id"
      :props="defaultProps"
      :expand-on-click-node="false"
      show-checkbox
      accordion
      highlight-current
      default-expand-all
    >
      <template #default="{ node, data }">
        <span>{{ data.category_name }}</span>
        <el-button type="text" size="small" @click.stop="editCategory(data)">编辑</el-button>
        <el-button type="text" size="small" @click.stop="deleteCategory(data)">删除</el-button>
      </template>
    </el-tree>

    <el-dialog title="新增/编辑分类" v-model:visible="showAddDialog">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.category_name" />
        </el-form-item>
        <el-form-item label="父级分类" :label-width="formLabelWidth">
          <el-select v-model="form.parent_id" placeholder="请选择父级分类">
            <el-option :label="'无'" :value="null" />
            <el-option
              v-for="cat in flatCategories"
              :key="cat.category_id"
              :label="cat.category_name"
              :value="cat.category_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.description" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="submitCategory">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';

const categories = ref([]);
const flatCategories = ref([]);
const showAddDialog = ref(false);
const formLabelWidth = '100px';
const form = reactive({
  category_id: null,
  category_name: '',
  parent_id: null,
  description: '',
});

const fetchCategories = async () => {
  try {
    const res = await axios.get('/api/categories');
    categories.value = res.data;
    flatCategories.value = flattenCategories(res.data);
  } catch (err) {
    console.error('获取分类失败', err);
  }
};

const flattenCategories = (data) => {
  let arr = [];
  const recurse = (nodes) => {
    nodes.forEach(node => {
      arr.push({ category_id: node.category_id, category_name: node.category_name });
      if (node.children && node.children.length) {
        recurse(node.children);
      }
    });
  };
  recurse(data);
  return arr;
};

const editCategory = (cat) => {
  form.category_id = cat.category_id;
  form.category_name = cat.category_name;
  form.parent_id = cat.parent_id;
  form.description = cat.description;
  showAddDialog.value = true;
};

const submitCategory = async () => {
  try {
    if (!form.category_name) {
      alert('分类名称不能为空');
      return;
    }

    if (form.category_id) {
      // 编辑
      await axios.put(`/api/categories/${form.category_id}`, {
        category_name: form.category_name,
        parent_id: form.parent_id,
        description: form.description,
      });
    } else {
      // 新增
      await axios.post('/api/categories', {
        category_name: form.category_name,
        parent_id: form.parent_id,
        description: form.description,
      });
    }
    showAddDialog.value = false;
    await fetchCategories();
  } catch (err) {
    console.error('提交分类失败', err);
  }
};

const deleteCategory = async (cat) => {
  if (!confirm(`确定删除分类 ${cat.category_name}？`)) return;
  try {
    await axios.delete(`/api/categories/${cat.category_id}`);
    await fetchCategories();
  } catch (err) {
    console.error('删除分类失败', err);
  }
};

onMounted(() => {
  fetchCategories();
});
</script>
