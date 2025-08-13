import Dashboard from '@/views/superadmin/Dashboard.vue';
import DashboardHome from '@/views/superadmin/DashboardHome.vue';
import AdminUsers from '@/views/superadmin/AdminUsers.vue';
import Categories from '@/views/superadmin/Categories.vue';
import Products from '@/views/superadmin/Products.vue';

export default [
  {
    path: '/superadmin',
    component: Dashboard,
    meta: { requiresAuth: true, role: 'superadmin' },
    children: [
      { path: 'dashboard', component: DashboardHome },
      { path: 'users', component: AdminUsers },
      { path: 'categories', component: Categories },
      { path: 'products', component: Products },
      { path: '', redirect: 'dashboard' },
    ],
  },
];
