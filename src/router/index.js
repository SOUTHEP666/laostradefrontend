import { createRouter, createWebHistory } from "vue-router";

import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";

import merchantRoutes from "./merchantRoutes.js";
import adminRoutes from "./adminRoutes.js";
import buyerRoutes from "./buyerRoutes.js";
import superadminRoutes from "./superadminRoutes.js";

const routes = [
  { path: "/", redirect: "/login" },

  // 登录注册
  { path: "/login", component: Login, meta: { requiresAuth: false } },
  { path: "/register", component: Register, meta: { requiresAuth: false } },

  // 超级管理员
  ...superadminRoutes,

  // 商家路由
  ...merchantRoutes,

  // 管理员路由
  ...adminRoutes,

  // 买家路由
  ...buyerRoutes,

  // 404重定向
  { path: "/:pathMatch(.*)*", redirect: "/login" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫：鉴权 + 角色权限控制
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  console.log("当前用户：", user);
  console.log("目标路由：", to.fullPath, to.meta);

  // 不需要鉴权页面
  if (to.meta.requiresAuth === false) {
    if (token && (to.path === "/login" || to.path === "/register")) {
      const roleHomeMap = {
        superadmin: "/superadmin/dashboard",
        admin: "/admin/dashboard",
        merchant: "/merchant/dashboard",
        buyer: "/buyer/home",
      };
      next(roleHomeMap[user.role] || "/login");
    } else {
      next();
    }
    return;
  }

  // 需要登录但无token，跳登录
  if (!token) {
    next("/login");
    return;
  }

  // 需要鉴权页面，校验角色权限
  if (to.meta.role) {
    const roles = Array.isArray(to.meta.role) ? to.meta.role : [to.meta.role];
    if (!user.role || !roles.includes(user.role)) {
      // 角色不匹配，跳对应首页或登录
      const roleHomeMap = {
        superadmin: "/superadmin/dashboard",
        admin: "/admin/dashboard",
        merchant: "/merchant/dashboard",
        buyer: "/buyer/home",
      };
      next(roleHomeMap[user.role] || "/login");
      return;
    }
  }

  next();
});

export default router;
