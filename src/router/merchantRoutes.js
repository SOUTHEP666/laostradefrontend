import MerchantLayout from '../components/MerchantLayout.vue';
import Dashboard from '../views/merchant/Dashboard.vue';
import Products from '../views/merchant/Products.vue';
import ProductEdit from '../views/merchant/ProductEdit.vue';
import Variants from '../views/merchant/Variants.vue';
import Attributes from '../views/merchant/Attributes.vue';
import Images from '../views/merchant/Images.vue';
import Orders from '../views/merchant/Orders.vue';
import Profile from '../views/merchant/Profile.vue';
import Reviews from '../views/merchant/Reviews.vue';
import Apply from '../views/merchant/Apply.vue';

function getIsReadOnly() {
  const status = localStorage.getItem('merchant_audit_status') || 'pending'; 
  return status === 'rejected'; 
}

export default [
  {
    path: '/merchants',
    component: MerchantLayout,
    meta: { requiresAuth: true, role: ['merchant'] },
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        props: route => ({ isReadOnly: getIsReadOnly(), ...route.params }),
        meta: { requiresAuth: true, role: ['merchant'] },
      },
      {
        path: 'products',
        component: Products,
        props: route => ({ isReadOnly: getIsReadOnly(), ...route.params }),
        meta: { requiresAuth: true, role: ['merchant'] },
      },
      {
        path: 'products/new',
        component: ProductEdit,
        props: route => ({ isReadOnly: getIsReadOnly(), ...route.params }),
        meta: { requiresAuth: true, role: ['merchant'] },
      },
      {
        path: 'products/:id/edit',
        component: ProductEdit,
        props: route => ({ isReadOnly: getIsReadOnly(), ...route.params }),
        meta: { requiresAuth: true, role: ['merchant'] },
      },
      {
        path: 'products/:id/variants',
        component: Variants,
        props: route => ({ isReadOnly: getIsReadOnly(), ...route.params }),
        meta: { requiresAuth: true, role: ['merchant'] },
      },
      {
        path: 'products/:id/attributes',
        component: Attributes,
        props: route => ({ isReadOnly: getIsReadOnly(), ...route.params }),
        meta: { requiresAuth: true, role: ['merchant'] },
      },
      {
        path: 'products/:id/images',
        component: Images,
        props: route => ({ isReadOnly: getIsReadOnly(), ...route.params }),
        meta: { requiresAuth: true, role: ['merchant'] },
      },
      {
        path: 'orders',
        component: Orders,
        props: route => ({ isReadOnly: getIsReadOnly(), ...route.params }),
        meta: { requiresAuth: true, role: ['merchant'] },
      },
      {
        path: 'profile',
        component: Profile,
        props: route => ({ isReadOnly: getIsReadOnly(), ...route.params }),
        meta: { requiresAuth: true, role: ['merchant'] },
      },
      {
        path: 'reviews',
        component: Reviews,
        props: route => ({ isReadOnly: getIsReadOnly(), ...route.params }),
        meta: { requiresAuth: true, role: ['merchant'] },
      },
      {
        path: 'apply',
        component: Apply,
        meta: { requiresAuth: true, role: ['merchant'] },
      },
    ],
  },
];
