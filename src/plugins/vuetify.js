import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import Ripple from 'vuetify/lib/directives/ripple';

Vue.use(Vuetify, {
  theme: {
    primary: '#0099cc',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#f75a5f',
    info: '#2196F3',
    success: '#7fad33',
    warning: '#FFC107',
  },
  directives: {
    Ripple,
  },
  iconfont: 'mdi',
});
