import { lazyLoadedRouteComponent } from './utils';

export default {
  path: '/invitation',
  component: { name: 'InvitationContainer', render: h => h('router-view') },
  children: [
    {
      path: '',
      name: 'invitation',
      beforeEnter: (to, from, next) => {
        if (to.query.isExisting === 'true') {
          next({
            name: 'invitation-accept',
            query: to.query,
          });
        } else {
          next({
            name: 'invitation-signup',
            query: to.query,
          });
        }
      },
    },
    {
      path: 'signup',
      name: 'invitation-signup',
      props: r => ({
        ...r.query,
      }),
      component: lazyLoadedRouteComponent({
        routeName: 'InvitationSignup',
        component: () => import(/* webpackChunkName: "invitation-signup" */ '@/views/InvitationContainer/SignupPage'),
      }),
    },
    {
      path: 'accept',
      name: 'invitation-accept',
      props: r => ({
        ...r.query,
      }),
      component: lazyLoadedRouteComponent({
        routeName: 'InvitationAccept',
        component: () => import(/* webpackChunkName: "invitation-accept" */ '@/views/InvitationContainer/AcceptPage'),
      }),
    },
  ],
};
