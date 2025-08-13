import BuyerDashboard from "@/views/buyer/BuyerDashboard.vue";
import BuyerHome from "@/views/buyer/BuyerHome.vue";
import BuyerVideo from "@/views/buyer/BuyerVideo.vue";
import BuyerChat from "@/views/buyer/BuyerChat.vue";
import BuyerCart from "@/views/buyer/BuyerCart.vue";
import BuyerProfile from "@/views/buyer/BuyerProfile.vue";
import BuyerProductList from "@/views/buyer/BuyerProductList.vue";
import BuyerProductDetail from "@/views/buyer/BuyerProductDetail.vue";

const buyerRoutes = [
  {
    path: "/buyer",
    component: BuyerDashboard, // 买家App布局页，带底部导航
    meta: { requiresAuth: true, role: "buyer" },
    redirect: "/buyer/home",
    children: [
      { path: "home", component: BuyerHome },
      { path: "video", component: BuyerVideo },
      { path: "chat", component: BuyerChat },
      { path: "cart", component: BuyerCart },
      { path: "profile", component: BuyerProfile },
      { path: "products", component: BuyerProductList },
      { path: "product/:id", component: BuyerProductDetail, props: true },
      // 其他买家相关页面...
    ],
  },
];

export default buyerRoutes;
