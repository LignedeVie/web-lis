import Vue from 'vue';
import PortalVue from 'portal-vue';
import Fragments from 'vue-fragment';

// these features will be native in vue3

// portals can render a subcomponent
// in another place in the app
Vue.use(PortalVue);

// fragments allows declaration of
// multiple root nodes per component
Vue.use(Fragments.Plugin);
