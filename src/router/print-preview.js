import { lazyLoadedRouteComponent } from './utils';

export default {
  path: '/print',
  name: 'print',
  component: lazyLoadedRouteComponent({
    routeName: 'PrintPreview',
    component: () => import(/* webpackChunkName: 'print' */ '@/views/dash/print/main'),
  }),
  children: [
    {
      path: 'lis/order/:id',
      name: 'lis-print-order',
      component: () => import(/* webpackChunkName: 'lis-print-order' */ '@/views/dash/print/lis-order'),
      meta: {
        title: 'Lab Order',
        subtitle: 'Print order details',
        hideFooter: true,
      },
    },
    {
      path: 'lis/test/:id',
      name: 'lis-print-test',
      component: () => import(/* webpackChunkName: 'lis-print-test' */ '@/views/dash/print/lis-order-test'),
      meta: {
        title: 'Lab Test',
        subtitle: 'Print test report',
        hideFooter: true,
      },
    },
    {
      path: 'lis/claim-stub/:id',
      name: 'lis-print-claim-stub',
      component: () => import(/* webpackChunkName: 'lis-print-claim-stub' */ '@/views/dash/print/lis-claim-stub'),
      meta: {
        title: 'Lab Order Claim Stub',
        subtitle: 'Print claim stub for test report',
        hideFooter: true,
      },
    },
    {
      path: 'lis/specimen/:specimen',
      name: 'lis-print-specimen-id',
      component: () => import(/* webpackChunkName: 'lis-print-specimen-id' */ '@/views/dash/print/lis-specimen-id'),
      meta: {
        title: 'Lab Test Specimen ID',
        subtitle: 'Print specimen ID for lab test',
        hideFooter: true,
      },
    },
    {
      path: 'lis/reports/specimen/:id',
      name: 'lis-print-order-tests-report',
      component: () => import(/* webpackChunkName: 'lis-print-order-tests-report' */ '@/views/dash/print/lis-order-tests-report'),
      meta: {
        title: 'Specimen Tracking Report',
        subtitle: 'Print specimen tracking report',
        hideFooter: true,
      },
    },
  ],
};
