import Vue from 'vue';
import { core as sdk } from '@mycure/sdk';
import store from '../store';
import {
  mcChatPlugin,
  mcCommonsPlugin,
  mcDiagnosticPlugin,
  mcGlobalMixinsPlugin,
  mcInsuranceContractsPlugin,
  mcLisPlugin,
  mcMedicalRecordsPlugin,
  mcNotificationsPlugin,
  mcServicesPlugin,
  mcTablePlugin,
} from '@web-plugins';

Vue.use(mcChatPlugin, { sdk, store });
Vue.use(mcCommonsPlugin, { sdk, store });
Vue.use(mcDiagnosticPlugin, { sdk, store });
Vue.use(mcGlobalMixinsPlugin, { sdk, store });
Vue.use(mcInsuranceContractsPlugin, { sdk, store });
Vue.use(mcLisPlugin, { sdk, store });
Vue.use(mcMedicalRecordsPlugin, { sdk, store });
Vue.use(mcNotificationsPlugin, { sdk, store });
Vue.use(mcServicesPlugin, { sdk, store });
Vue.use(mcTablePlugin, { sdk, store });
