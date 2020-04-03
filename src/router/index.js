import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// ========================
//    BUILD ENTRY ROUTES
// ========================

const routes = [];

routes.push(require('./lis').default);
routes.push(require('./settings').default);
routes.push(require('./print-preview').default);

if (process.env.VUE_APP_MODE === 'online') {
  routes.push(require('./auth-management').default);
  routes.push(require('./invitation').default);
}

// skeleton routes
routes.push(...[
  {
    path: '/',
    name: 'landing',
    component: require('@/views/LandingPage').default,
    props: {
      redirectFn () {
        let signinURI = process.env.VUE_APP_SIGNIN_URI || '/signin';
        // external URI
        if (signinURI.startsWith('http')) {
          const ssoURI = new URL(signinURI);
          ssoURI.searchParams.set('target', location.origin + '/lis');
          signinURI = ssoURI.href;
        } else {
          signinURI += '?target=/lis';
        }

        this.$log('signin @', signinURI);

        // external URI
        if (signinURI.startsWith('http')) {
          location.href = signinURI;
          return;
        }

        // local path
        this.$router.push({
          path: signinURI,
          query: {
            target: '/lis',
          },
        });
      },
    },
    meta: { requiresUnauth: true },
  },
  {
    path: '/signout',
    name: 'signout',
    props: r => ({
      ...r.query,
      signoutFn () {
        return this.$store.dispatch('auth/signout');
      },
    }),
    component: () => import(/* webpackChunkName: "signout-page" */ '@/views/SignoutPage'),
  },
  {
    path: '/signin',
    name: 'signin',
    props: r => r.query,
    component: () => import(/* webpackChunkName: "signin-page" */ '@/views/SigninPage'),
    meta: { requiresUnauth: true },
  },
  {
    path: '/forbidden',
    name: 'forbidden',
    alias: ['/301'],
    props: r => r.query,
    component: () => import(/* webpackChunkName: "forbidden-page" */ '@/views/ForbiddenPage'),
  },
  {
    path: '*',
    name: 'notfound',
    props: r => ({ target: r.fullpath }),
    component: () => import(/* webpackChunkName: "notfound-page" */ '@/views/NotFoundPage'),
  },
]);

// ========================
//      BUILD ROUTER
// ========================

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
