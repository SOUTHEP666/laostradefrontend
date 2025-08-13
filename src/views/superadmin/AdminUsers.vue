<template>
  <div>
    <h2>用户管理</h2>

    <!-- 搜索栏 -->
    <div style="margin-bottom: 10px; display: flex; gap: 10px;">
      <el-input
        v-model="keyword"
        placeholder="搜索用户名或邮箱"
        style="width: 300px"
        clearable
      />
      <el-select
        v-model="roleFilter"
        placeholder="选择角色"
        clearable
        style="width: 150px"
      >
        <el-option label="超级管理员" value="superadmin" />
        <el-option label="管理员" value="admin" />
        <el-option label="商家" value="merchant" />
        <el-option label="买家" value="buyer" />
      </el-select>
      <el-button
        type="danger"
        :disabled="multipleSelection.length === 0"
        @click="handleBatchDelete"
      >
        批量删除
      </el-button>
    </div>

    <!-- 用户表格 -->
    <el-table
      :data="users"
      style="width: 100%"
      v-loading="loading"
      :row-key="row => row.id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="role" label="角色" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.is_active"
            @change="toggleStatus(row)"
            active-text="启用"
            inactive-text="禁用"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240">
        <template #default="{ row }">
          <el-button size="small" @click="openEditDialog(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteUser(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      layout="prev, pager, next"
      @current-change="pageChange"
      style="margin-top: 15px;"
    />

    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑用户"
      v-model="editDialogVisible"
      width="400px"
      :before-close="handleDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="editForm.role" placeholder="请选择角色">
            <el-option label="超级管理员" value="superadmin" />
            <el-option label="管理员" value="admin" />
            <el-option label="商家" value="merchant" />
            <el-option label="买家" value="buyer" />
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态" prop="is_active">
          <el-switch
            v-model="editForm.is_active"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import request from "@/api/request";
import { ElMessage, ElMessageBox } from "element-plus";

const users = ref([]);
const keyword = ref("");
const roleFilter = ref("");
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const loading = ref(false);

const multipleSelection = ref([]);

const editDialogVisible = ref(false);
const editForm = ref({
  id: null,
  username: "",
  email: "",
  role: "",
  is_active: true,
});
const editFormRef = ref(null);

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确邮箱地址", trigger: ["blur", "change"] },
  ],
  role: [{ required: true, message: "请选择角色", trigger: "change" }],
};

// 防抖定时器
let debounceTimeout = null;

// 监听 keyword 和 roleFilter，防抖搜索
watch([keyword, roleFilter], () => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    page.value = 1;
    fetchUsers();
  }, 500);
});

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await request.get("/admin/users", {
      params: {
        page: page.value,
        limit: limit.value,
        keyword: keyword.value.trim(),
        role: roleFilter.value || undefined,
      },
    });
    users.value = res.data;
    total.value = res.total;
  } catch (err) {
    console.error("获取用户列表失败", err);
    ElMessage.error("获取用户列表失败");
  } finally {
    loading.value = false;
  }
};

const pageChange = (newPage) => {
  page.value = newPage;
  fetchUsers();
};

const toggleStatus = async (user) => {
  try {
    await request.patch(`/admin/users/${user.id}/status`, {
      is_active: user.is_active,
    });
    ElMessage.success(`用户${user.username}状态已更新`);
  } catch (err) {
    console.error("修改状态失败", err);
    ElMessage.error("修改状态失败");
  }
};

const deleteUser = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确认要删除用户 "${user.username}" 吗？此操作不可撤销！`,
      "警告",
      { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
    );
    await request.delete(`/admin/users/${user.id}`);
    ElMessage.success("删除成功");
    fetchUsers();
  } catch (err) {
    if (err !== "cancel") {
      console.error("删除用户失败", err);
      ElMessage.error("删除失败");
    }
  }
};

const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

const handleBatchDelete = async () => {
  if (multipleSelection.value.length === 0) return;
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${multipleSelection.value.length} 个用户吗？`,
      "警告",
      { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
    );
    const ids = multipleSelection.value.map((item) => item.id);
    await request.post("/admin/users/batch-delete", { ids });
    ElMessage.success("批量删除成功");
    multipleSelection.value = [];
    fetchUsers();
  } catch (err) {
    if (err !== "cancel") {
      console.error("批量删除失败", err);
      ElMessage.error("批量删除失败");
    }
  }
};

const openEditDialog = (user) => {
  Object.assign(editForm.value, {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    is_active: !!user.is_active,
  });
  if (editFormRef.value) {
    editFormRef.value.clearValidate();
  }
  editDialogVisible.value = true;
};

const handleDialogClose = (done) => {
  editDialogVisible.value = false;
  done && done();
};

const submitEditForm = () => {
  editFormRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      const { id, username, email, role, is_active } = editForm.value;
      await request.put(`/admin/users/${id}`, {
        username,
        email,
        role,
        is_active,
      });
      ElMessage.success("更新成功");
      editDialogVisible.value = false;
      fetchUsers();
    } catch (err) {
      console.error("更新失败", err);
      ElMessage.error("更新失败");
    }
  });
};

fetchUsers();
</script>
