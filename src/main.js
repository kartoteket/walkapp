// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'

import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import VueAnalytics from 'vue-analytics'

import Header from 'components/Header'
import Footer from 'components/Footer'

// gloabl components (mayb better registered in App.vue and used in that scope/template ???!?)
Vue.component('header-component', Header)
Vue.component('footer-component', Footer)

// keep vue-router and vuex store in sync.
sync(store, router)

//  Google Analytics
const trackingId = 'UA-72588862-2'
Vue.use(VueAnalytics, {
  id: trackingId,
  router,
  debug: {
    enabled: false,
    trace: false,
    sendHitTask: true
  }
})

// Sentry Raven
if (process.env.NODE_ENV === 'production') {
  Raven
      .config('https://97ee13fdbe364d1388393fa9315aacc3@sentry.io/153958')
      .addPlugin(RavenVue, Vue)
      .install()
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})

