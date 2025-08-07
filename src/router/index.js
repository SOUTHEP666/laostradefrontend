import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import BuyerHome from "@/views/BuyerHome.vue";
import SellerHome from "@/views/MerchantApply.vue";
import Admin1Home from "@/views/Admin1Home.vue";
import Admin2Home from "@/views/Admin2Home.vue";

const routes = [
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/buyer-home", component: BuyerHome, meta: { roles: [1] } },
  { path: "/seller-home", component: SellerHome, meta: { roles: [2] } },
  { path: "/admin1-home", component: Admin1Home, meta: { roles: [3] } },
  { path: "/admin2-home", component: Admin2Home, meta: { roles: [4] } },
  { path: "/", redirect: "/login" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (to.path === "/login" || to.path === "/register") {
    next();
    return;
  }

  if (!user) {
    // 未登录，跳转登录
    next("/login");
    return;
  }

  if (to.meta.roles && !to.meta.roles.includes(user.role)) {
    // 无权限，重定向到登录或其他页面
    alert("无访问权限");
    next("/login");
    return;
  }

  next();
});

export default router;
