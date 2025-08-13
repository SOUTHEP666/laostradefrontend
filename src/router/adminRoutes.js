import AdminDashboard from "@/views/admin/AdminDashboard.vue";
import AdminMerchants from "@/views/admin/AdminMerchants.vue"; // 这里要确保文件存在且路径正确
import AdminOrders from "@/views/admin/AdminOrders.vue";
import AdminReviews from "@/views/admin/AdminReviews.vue";
import AdminProducts from "@/views/admin/AdminProducts.vue";
import AdminHome from "@/views/admin/AdminHome.vue"; // 如果你用了这个

export default [
  {
    path: "/admin",
    component: AdminDashboard,
    meta: { requiresAuth: true, role: "admin" },
    children: [
      { path: "dashboard", component: AdminHome },
      { path: "merchants", component: AdminMerchants },
      { path: "orders", component: AdminOrders },
      { path: "reviews", component: AdminReviews },
      { path: "products", component: AdminProducts },
      { path: "", redirect: "dashboard" },
    ],
  },
];
