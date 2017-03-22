import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Frontpage from 'components/Frontpage'
// import Welcome from 'components/Welcome'
import mapItems from 'components/MapItems'
import RegisterItem from 'components/RegisterItem'
import saveItem from 'components/SaveItem'
import notFound from 'components/notFound'

var router = new Router({
  /* eslint-disable no-multi-spaces  */
  routes: [
    { path: '/',                   name: 'splash', component: Frontpage,     props: true },
    { path: '/:walk_id',           name: 'frontpage', component: Frontpage,     props: true },
    // { path: '/:walk_id/velkommen', name: 'welcome',   component: Welcome,       props: true },
    { path: '/:walk_id/kart',      name: 'map',       component: mapItems,      props: true },
    { path: '/:walk_id/registrer', name: 'register',  component: RegisterItem,  props: true },
    { path: '/:walk_id/lagre',     name: 'save',      component: saveItem,      props: true },
    { path: '*',                   name: 'notfound',  component: notFound }
  ]
})

// router guard: close menu
router.beforeEach(function (to, from, next) {
  router.app.openMenu = false
  next()
})

export default router
