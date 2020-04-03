import { lazyLoadedRouteComponent } from './utils';

export default {
  path: '/settings/:clinic',
  name: 'settings',
  component: lazyLoadedRouteComponent({
    routeName: 'Settings',
    component: () => import(/* webpackChunkName: 'settings' */ '@/views/dash/settings/main'),
  }),
  props: true,
  meta: {
    title: 'Settings',
    requiresAuth: true,
    requiresActiveOrganization: true,
  },
  children: [
    /* Clinic */
    {
      path: 'clinic-details',
      name: 'settings-clinic-details',
      component: () => import(/* webpackChunkName: 'settings-clinic-details' */ '@/views/dash/settings/clinic-details'),
    },
    {
      path: 'clinic-members',
      name: 'settings-clinic-members',
      component: () => import(/* webpackChunkName: 'settings-clinic-members' */ '@/views/dash/settings/clinic-members'),
    },
    {
      path: 'clinic-branches',
      name: 'settings-clinic-branches',
      component: () => import(/* webpackChunkName: 'settings-clinic-branches' */ '@/views/dash/settings/clinic-branches'),
    },
    {
      path: 'clinic-update-branches',
      name: 'settings-clinic-update-branches',
      component: () => import(/* webpackChunkName: 'settings-clinic-update-branches' */ '@/views/dash/settings/clinic-update-branches'),
      props: true,
    },
    {
      path: 'clinic-history',
      name: 'settings-clinic-history',
      component: () => import(/* webpackChunkName: 'settings-clinic-history' */ '@/views/dash/settings/clinic-history'),
    },
    {
      path: 'clinic-printing-header',
      name: 'settings-clinic-printing-header',
      component: () => import(/* webpackChunkName: 'settings-clinic-printing-header' */ '@/views/dash/settings/clinic-print-header'),
    },
    {
      path: 'clinic-language-settings',
      name: 'settings-clinic-language-settings',
      component: () => import(/* webpackChunkName: 'settings-clinic-language-settings' */ '@mycure/web-plugins/lib/components/settings/clinic/lang-settings'),
    },
    /* Partners */
    {
      path: 'partners-hmos',
      name: 'settings-partners-hmos',
      component: () => import(/* webpackChunkName: 'settings-partners-hmos' */ '@mycure/web-plugins/lib/components/settings/partners/hmos'),
    },
    {
      path: 'partners-companies',
      name: 'settings-partners-companies',
      component: () => import(/* webpackChunkName: 'settings-partners-companies' */ '@mycure/web-plugins/lib/components/settings/partners/companies'),
    },
    {
      path: 'partners-diagnostic-centers',
      name: 'settings-partners-diagnostic-centers',
      component: () => import(/* webpackChunkName: 'settings-partners-diagnostic-centers' */ '@mycure/web-plugins/lib/components/settings/partners/diagnostic-centers'),
    },
    {
      path: 'partners-gov-insurances',
      name: 'settings-partners-gov-insurances',
      component: () => import(/* webpackChunkName: 'settings-partners-gov-insurances' */ '@mycure/web-plugins/lib/components/settings/partners/gov-insurances'),
    },
    /* Laboratory */
    {
      path: 'laboratory-test-directory',
      name: 'settings-laboratory-test-directory',
      component: () => import(/* webpackChunkName: 'settings-laboratory-test-directory' */ '@mycure/web-plugins/lib/components/settings/laboratory/test-directory'),
    },
    {
      path: 'laboratory-analyzers',
      name: 'settings-laboratory-analyzers',
      component: () => import(/* webpackChunkName: 'settings-laboratory-analyzers' */ '@mycure/web-plugins/lib/components/settings/laboratory/analyzers'),
    },
    {
      path: 'laboratory-report-templates',
      name: 'settings-laboratory-report-templates',
      component: () => import(/* webpackChunkName: 'settings-laboratory-report-templates' */ '@mycure/web-plugins/lib/components/settings/laboratory/report-templates'),
    },
    {
      path: 'laboratory-order-templates',
      name: 'settings-laboratory-order-templates',
      component: () => import(/* webpackChunkName: 'settings-laboratory-order-templates' */ '@mycure/web-plugins/lib/components/settings/laboratory/order-templates'),
    },
    {
      path: 'laboratory-report-targets',
      name: 'settings-laboratory-report-targets',
      component: () => import(/* webpackChunkName: 'settings-laboratory-report-targets' */ '@mycure/web-plugins/lib/components/settings/laboratory/report-targets'),
    },
    {
      path: 'laboratory-printing',
      name: 'settings-laboratory-printing',
      component: () => import(/* webpackChunkName: 'settings-laboratory-printing' */ '@mycure/web-plugins/lib/components/settings/laboratory/printing'),
    },
    {
      path: 'laboratory-order-specimen-id',
      name: 'settings-laboratory-order-specimen-id',
      component: () => import(/* webpackChunkName: 'settings-laboratory-order-specimen-id' */ '@mycure/web-plugins/lib/components/settings/laboratory/order-specimen-id'),
    },
  ],
};
