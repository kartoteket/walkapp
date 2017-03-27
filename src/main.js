// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'
import Header from 'components/Header'
import Footer from 'components/Footer'

// gloabl components (Mayb better registered in App.vue and used in that scope/template ???!?)
Vue.component('header-component', Header)
Vue.component('footer-component', Footer)

// keep vue-router and vuex store in sync.
sync(store, router)

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

