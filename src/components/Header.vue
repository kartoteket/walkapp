<template>
  <div class="webapp__header" v-if="walk.id">

      <router-link :to="{ name: 'frontpage'}" class="webapp-title">
          <img src="../assets/img/tv-logo-small.png" alt="Trygghetsvandringer">
          {{walk.title}}
      </router-link>

      <a href="#" v-on:click.prevent="openMenu = !openMenu" v-bind:class="{ expanded : openMenu }" class="nav-item" >
          <svg class="icon nav-icon nav-icon--open"><use xlink:href="#icon-menu"></use></svg>
          <svg class="icon nav-icon nav-icon--close"><use xlink:href="#icon-close"></use></svg>
      </a>

      <div class="main-navigation main-navigation--mobile">
         <div class="mobile-menu-overlay" v-bind:class="{ expanded : openMenu }">

              <nav class="main-nav">
                  <ul class="nav">

                      <li v-on:click="openMenu = false"><router-link :to="{ name: 'frontpage'}" class="nav__item">Startside</router-link></li>
                      <li v-on:click="openMenu = false"><router-link :to="{ name: 'map'}" class="nav__item">Vis funn i kart</router-link></li>
                      <li v-on:click="openMenu = false"><router-link :to="{ name: 'register'}" class="nav__item">Registrer nytt funn</router-link></li>
                      <li> <a :href="logoutUrl" class="nav__item">Avslutt registrering</a> </li>

                      <li class="nav__sep"></li>

                      <li><a class="nav__item" :href="rootUrl + '/vandringer/users'">Din profil</a></li>
                      <li><a class="nav__item" :href="rootUrl + '/vandringer/vandringer'">Dine vandringer</a></li>
                      <li><a class="nav__item" :href="rootUrl + '/vandringer/pages/tryggere-triveligere-og-tilgjengelig'">Om Trygghetsvandringer</a></li>
                      <li> <a :href="rootUrl + '/index.php/actions/social/logout?redirect=vandringer'" class="nav__item">Logg ut</a> </li>
                  </ul>
              </nav>
          </div>
      </div>
  </div>
  <div class="webapp__header" v-else>
    <span class="webapp-title">Velkommen</span>
  </div>
</template>

<script>
export default {
  name: 'header-component',

  data: function () {
    return {
      openMenu: false
    }
  },

  computed: {

    walk () {
      return this.$store.state.walk
    },

    rootUrl () {
      return this.$store.state.Xconfig.rootUrl
    },

    logoutUrl () {
      return this.rootUrl + '/vandringer/vandringer/' + this.walk.id
    }
  }
}
</script>

<style>
  .webapp-title {
    text-align: center;
  }
  .mobile-menu-overlay {
    background-color: #e77f25;
  }
</style>
