import { lazyLoadedRouteComponent } from './utils';

export default {
  path: '/authentication-management',
  component: { name: 'AuthenticationManagementContainer', render: h => h('router-view') },
  children: [
    {
      path: 'change-email',
      name: 'authentication-management-change-email',
      props: r => ({
        ...r.query,
        title: 'Change Email',
        loadingText: 'Changing email...',
        successText: 'Email successfully changed!',
      }),
      component: lazyLoadedRouteComponent({
        routeName: 'AuthenticationManagementChangeEmail',
        component: () => import(/* webpackChunkName: "authentication-management-apply-action-code-page" */ '@/views/AuthenticationManagementContainer/ApplyActionCodePage'),
      }),
    },
    {
      path: 'change-password',
      name: 'authentication-management-change-password',
      props: r => ({
        ...r.query,
        title: 'Change Password',
        loadingText: 'Changing password...',
        successText: 'Password successfully changed!',
      }),
      component: lazyLoadedRouteComponent({
        routeName: 'AuthenticationManagementChangePassword',
        component: () => import(/* webpackChunkName: "authentication-management-apply-action-code-page" */ '@/views/AuthenticationManagementContainer/ApplyActionCodePage'),
      }),
    },
    {
      path: 'verify-email',
      name: 'authentication-management-verify-email',
      props: r => ({
        ...r.query,
        title: 'Verify Email',
        loadingText: 'Verifying email...',
        successText: 'Email successfully verified!',
      }),
      component: lazyLoadedRouteComponent({
        routeName: 'AuthenticationManagementVerifyEmail',
        component: () => import(/* webpackChunkName: "authentication-management-apply-action-code-page" */ '@/views/AuthenticationManagementContainer/ApplyActionCodePage'),
      }),
    },
    {
      path: 'verify-password-reset',
      name: 'authentication-management-verify-password-reset',
      props: r => r.query,
      component: lazyLoadedRouteComponent({
        routeName: 'AuthenticationManagementVerifyPasswordReset',
        component: () => import(/* webpackChunkName: "authentication-management-verify-password-reset-page" */ '@/views/AuthenticationManagementContainer/VerifyPasswordResetPage'),
      }),
    },
  ],
};
