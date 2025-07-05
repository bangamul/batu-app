// import { createRouter, createWebHistory } from '@ionic/vue-router';
// import { RouteRecordRaw } from 'vue-router';
// import TabsPage from '../views/TabsPage.vue'

// const routes: Array<RouteRecordRaw> = [
//   {
//     path: '/',
//     redirect: '/tabs/tab1'
//   },
//   {
//     path: '/tabs/',
//     component: TabsPage,
//     children: [
//       {
//         path: '',
//         redirect: '/tabs/tab1'
//       },
//       {
//         path: 'tab1',
//         component: () => import('@/views/Tab1Page.vue')
//       },
//       {
//         path: 'tab2',
//         component: () => import('@/views/Tab2Page.vue')
//       },
//       {
//         path: 'tab3',
//         component: () => import('@/views/Tab3Page.vue')
//       }
//     ]
//   }
// ]

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes
// })

// export default router

import { createRouter, createWebHistory } from '@ionic/vue-router';
import Home from '../pages/Home.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/detail/:id', component: () => import('../pages/Detail.vue') },
  { path: '/scan', component: () => import('../pages/Scan.vue') },
  { path: '/admin', component: () => import('../pages/Admin.vue') },
  { path: '/cek', component: () => import('../pages/CekJenisBatu.vue') },
  { path: '/daftarbatu', component: () => import('../pages/DaftarBatu.vue') },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
