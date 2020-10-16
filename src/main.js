import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import VuePapaParse from 'vue-papa-parse';

import NoSideBar from '@/components/layouts/NoSideBar'
import DefaultLayout from '@/components/layouts/DefaultLayout'

Vue.config.productionTip = false
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);
Vue.use(VuePapaParse);

Vue.component('default-layout', DefaultLayout)
Vue.component('no-sidebar-layout', NoSideBar)
Vue.prototype.$http = axios

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

