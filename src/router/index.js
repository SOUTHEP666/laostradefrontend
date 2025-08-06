import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: () => import("../views/Login.vue") },

  // 普通用户
  { path: "/user/home", component: () => import("../views/user/Home.vue") },

  // 商家后台
  { path: "/seller/dashboard", component: () => import("../views/seller/Dashboard.vue") },

  // 管理员后台
  { path: "/admin/dashboard", component: () => import("../views/admin/Dashboard.vue") },

{
  path: "/register",
  name: "Register",
  component: () => import("@/views/Register.vue"),
}





  // 其他路由...
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
