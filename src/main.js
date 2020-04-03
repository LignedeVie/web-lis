import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import '@/plugins/mycure';
import '@/plugins/vuetify';
import '@/plugins/vue3-compat';
import '@/plugins/service-worker';
import '@/plugins/vue-tour';
import '@/plugins/no-scroll';
import '@/plugins/firebase';

import '@/stylus/main.styl';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
