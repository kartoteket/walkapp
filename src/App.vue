<template>
  <div id="app">
    <router-view class="webapp"></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',

  data: function () {
    return {
      walkId: this.$route.params.walk_id
    }
  },

  // initApp
  created: function () {
    if (this.walkId) {
      this.$store.dispatch('initApp')
    }
  }
}
</script>

<style>
#app {
/*  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;*/
}

.is-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  vertical-align: bottom;
  text-align: center;
  z-index: 999;

  background-color: rgba(255,255,255,.5);
  outline: 1px solid red;
}
</style>
