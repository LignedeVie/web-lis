import Vue from 'vue';
import {
  prettifyName,
  prettifyNameFirst,
  prettifyDoctorNameFirst,
  prettifyProfessionalName,
  middleInitalInjector,
  prettifyAddress,
  formatDecimal,
} from '@web-plugins/utils/string';

Vue.filter('prettifyName', prettifyName);
Vue.filter('prettifyNameFirst', prettifyNameFirst);
Vue.filter('prettifyDoctorNameFirst', prettifyDoctorNameFirst);
Vue.filter('prettifyProfessionalName', prettifyProfessionalName);
Vue.filter('middleInitalInjector', middleInitalInjector);
Vue.filter('prettifyAddress', prettifyAddress);
Vue.filter('formatDecimal', formatDecimal);
