import { createRouter, createWebHistory } from "vue-router";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import Profile from "../views/Profile.vue";
import ChangePassword from "../views/ChangePassword.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/register", component: Register },
  { path: "/login", component: Login },
  { path: "/profile", component: Profile },
  { path: "/change-password", component: ChangePassword },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
