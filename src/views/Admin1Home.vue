<template>
  <div>
    <el-card>
      <h2>用户管理</h2>
      <el-table :data="users" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="role" label="角色" />
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-select v-model="scope.row.role" @change="updateRole(scope.row)">
              <el-option :value="1" label="买家" />
              <el-option :value="2" label="商家" />
              <el-option :value="3" label="一级管理员" />
              <el-option :value="4" label="二级管理员" />
            </el-select>
            <el-button type="danger" @click="deleteUser(scope.row.id)" size="small" style="margin-left: 10px;">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "../utils/axios";

const users = ref([]);

const fetchUsers = async () => {
  const res = await axios.get("/admin/users");
  users.value = res.data;
};

const updateRole = async (user) => {
  await axios.put(`/admin/user/${user.id}`, { role: user.role });
};

const deleteUser = async (id) => {
  await axios.delete(`/admin/user/${id}`);
  fetchUsers();
};

onMounted(() => {
  fetchUsers();
});
</script>
