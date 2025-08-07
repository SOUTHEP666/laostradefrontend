<template>
  <div class="merchant-apply">
    <el-form :model="form" label-width="120px" @submit.prevent>
      <el-form-item label="企业名称"><el-input v-model="form.company_name" /></el-form-item>
      <el-form-item label="联系人"><el-input v-model="form.contact_name" /></el-form-item>
      <el-form-item label="联系电话"><el-input v-model="form.contact_phone" /></el-form-item>
      <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
      <el-form-item label="用户名"><el-input v-model="form.username" /></el-form-item>
      <el-form-item label="密码"><el-input type="password" v-model="form.password" /></el-form-item>

      <el-form-item label="营业执照">
        <el-input v-model="form.business_license" placeholder="营业执照链接或编号" />
      </el-form-item>
      <el-form-item label="税务登记证">
        <el-input v-model="form.tax_registration" placeholder="税务登记编号" />
      </el-form-item>
      <el-form-item label="法人身份证">
        <el-input v-model="form.id_card" placeholder="身份证编号或图片链接" />
      </el-form-item>
      <el-form-item label="其他资质">
        <el-input v-model="form.extra_certification" placeholder="如食品许可证等" />
      </el-form-item>

      <el-button type="primary" @click="submit">提交申请</el-button>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "@/utils/axios";

const form = ref({
  company_name: "",
  contact_name: "",
  contact_phone: "",
  username: "",
  password: "",
  email: "",
  business_license: "",
  tax_registration: "",
  id_card: "",
  extra_certification: "",
});

const submit = async () => {
  try {
    await axios.post("/merchant/apply", form.value);
    alert("申请提交成功，等待审核");
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped>
.merchant-apply {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
}
</style>
