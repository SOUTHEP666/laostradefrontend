// 文件：src/router/index.js

import { createRouter, createWebHistory } from "vue-router";

import HomeLayout from "../layouts/HomeLayout.vue";

import Home from "../views/Home.vue";
import Category from "../views/Category.vue";
import Chat from "../views/Chat.vue";
import Cart from "../views/Cart.vue";
import Profile from "../views/Profile.vue";
import ChangePassword from "../views/ChangePassword.vue";

import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import ProductDetail from "../views/ProductDetail.vue"; // ✅ 新增：详情页
import NotFound from "../views/NotFound.vue";

const routes = [
  {
    path: "/",
    component: HomeLayout,
    children: [
      { path: "", redirect: "/home" },
      { path: "home", component: Home },
      { path: "category", component: Category },
      { path: "chat", component: Chat },
      { path: "cart", component: Cart },
      { path: "profile", component: Profile },
      { path: "change-password", component: ChangePassword },

      // 登录/注册页仍然在布局里（可按需调整）
      { path: "register", component: Register },
      { path: "login", component: Login },
    ],
  },

  // ✅ 商品详情页独立于 HomeLayout
  {
    path: "/product/:id",
    component: ProductDetail,
  },

  // ✅ 404 页面
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
