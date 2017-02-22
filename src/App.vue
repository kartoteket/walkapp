<template>
  <div id="app">
    <router-view class="webapp"></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',

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
</style>
