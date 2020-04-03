import { lazyLoadedRouteComponent } from '../utils';
import emrRoutes from './emr';

export default {
  path: '/lis',
  name: 'main',
  component: lazyLoadedRouteComponent({
    routeName: 'LIS',
    component: () => import(/* webpackChunkName: 'main' */ '@/views/dash/main'),
  }),
  redirect: '/lis/tests',
  meta: {
    requiresAuth: true,
    requiresActiveOrganization: true,
  },
  children: [
    {
      path: 'update-clinic',
      name: 'update-clinic',
      component: () => import(/* webpackChunkName: 'update-clinic' */ '@/views/dash/clinic-dashboard/update-clinic'),
      meta: {
        title: 'Your Clinic',
        subtitle: "Welcome! Let's get started!",
      },
    },
    {
      path: 'dashboard',
      name: 'lis-dashboard',
      component: () => import(/* webpackChunkName: 'lis-dashboard' */ '@/views/dash/lis/dashboard'),
      meta: {
        title: 'Dashboard',
      },
    },
    {
      path: 'tests',
      name: 'lis-tests',
      component: () => import(/* webpackChunkName: 'lis-tests' */ '@/views/dash/lis/tests'),
      meta: {
        title: 'Lab Worklist',
        subtitle: 'View, proofread, and finalize laboratory test findings',
      },
    },
    {
      path: 'orders',
      name: 'lis-orders',
      component: () => import(/* webpackChunkName: 'lis-orders' */ '@/views/dash/lis/orders'),
      meta: {
        title: 'Print Lab Orders',
        subtitle: 'View and print laboratory orders in the list',
      },
    },
    {
      path: 'test/:id',
      name: 'lis-test',
      component: () => import(/* webpackChunkName: 'lis-test' */ '@/views/dash/lis/test'),
      meta: {
        title: 'Lab Test Report',
        subtitle: 'Report details',
      },
    },
    {
      path: 'reports/specimen',
      name: 'lis-order-tests-reports',
      component: () => import(/* webpackChunkName: 'lis-order-tests-reports' */ '@/views/dash/lis/order-tests-reports'),
      meta: {
        title: 'Specimen Tracking Reports',
        subtitle: 'View and create specimen tracking reports',
      },
    },
    {
      path: 'reports/specimen/create',
      name: 'lis-order-tests-report-create',
      component: () => import(/* webpackChunkName: 'lis-order-tests-report-create' */ '@/views/dash/lis/order-tests-report-create'),
      meta: {
        title: 'Create Specimen Tracking Report',
        subtitle: '',
      },
    },
    {
      path: 'reports/specimen/read/:id',
      name: 'lis-order-tests-report',
      component: () => import(/* webpackChunkName: 'lis-order-tests-report' */ '@/views/dash/lis/order-tests-report'),
      meta: {
        title: 'Specimen Tracking Report',
        subtitle: '',
      },
    },
    ...emrRoutes,
  ],
};
