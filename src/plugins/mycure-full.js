import Vue from 'vue';
import store from '@/store';
import router from '@/router';
import plugins from '@mycure/vue-plugins/lib';
import { core as sdk } from '@mycure/sdk';

Vue.use(plugins, {
  sdk,
  store,
  router,
  all: false,
  modules: {
    // auth and org
    accounts: true,
    'activity-logs': true,
    fixtures: true,
    'global-snackbar': true,
    patients: { namespace: 'patientsv5' },
  },
});
