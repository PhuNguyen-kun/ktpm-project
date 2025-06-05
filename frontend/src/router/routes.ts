import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/components/Layout/Layout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
      },
      {
        path: 'households',
        name: 'households',
        component: () => import('@/views/Households.vue'),
      },
      {
        path: 'residents',
        name: 'residents',
        component: () => import('@/views/Residents.vue'),
      },
      {
        path: 'vehicles',
        name: 'vehicles',
        component: () => import('@/views/Vehicles.vue'),
      },
      {
        path: 'fee-types',
        name: 'fee-types',
        component: () => import('@/views/FeeTypes.vue'),
      },
      {
        path: 'fee-campaigns',
        name: 'fee-campaigns',
        component: () => import('@/views/FeeCampaigns.vue'),
      },
      {
        path: 'household-fee-assignments',
        name: 'household-fee-assignments',
        component: () => import('@/views/HouseholdFeeAssignments.vue'),
      },
    ],
  },
]

export default routes
