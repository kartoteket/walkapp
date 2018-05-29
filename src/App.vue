<template>
  <div id="app">
    <router-view class="webapp"></router-view>
    <!-- modal for error messages-->
    <modal ref="modal"></modal>
  </div>

</template>

<script>

export default {
  name: 'app',

  components: {
    'Modal': () => import(/* webpackChunkName: "modal" */ './components/Modal')
  },

  data () {
    return {
      walkId: this.$route.params.walk_id
    }
  },

  computed: {
    appMessage () {
      return this.$store.state.appMessage
    }
  },

  // initApp
  created () {
    if (this.walkId) {
      this.$store.dispatch('initApp')
    }
  },

  watch: {
    appMessage (val, oldVal) {
      if (this.$refs.modal/* && val.code === 401 */) {
        this.$refs.modal.open()
      }
    }
  }
}
</script>

<style>

.is-loading {
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
  vertical-align: bottom;
  text-align: center;
  z-index: 999;

  background-color: rgba(255,255,255,.5);
  outline: 1px solid red;
}
</style>
