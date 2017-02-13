<template>
  <div class="webapp__header">


      <router-link :to="{ name: 'welcome'}" class="webapp-title">
          <img src="../assets/tv-logo-small.png" alt="Trygghetsvandringer">
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

                      <li v-on:click="openMenu = false"><router-link :to="{ name: 'welcome'}" class="nav__item">Forsiden</router-link></li>
                      <li v-on:click="openMenu = false"><router-link :to="{ name: 'map'}" class="nav__item">Vis funn på kart</router-link></li>
                      <li v-on:click="openMenu = false"><router-link :to="{ name: 'register'}" class="nav__item">Registrer nytt funn</router-link></li>

                      <li class="nav__sep"></li>

                      <li><a class="nav__item" href="/vandringer/users"> Din profil </a></li>
                      <li><a class="nav__item" href="/vandringer/vandringer"> Flere vandringer </a></li>
                      <li><a class="nav__item" href="/vandringer/pages/tryggere-triveligere-og-tilgjengelig">Om Trygghetsvandringer</a></li>
                      <li> <a :href="logoutUrl" class="nav__item">Avslutt</a> </li>
                      <li> <a href="/index.php/actions/social/logout?redirect=vandringer" class="nav__item">Logout</a> </li>

                  </ul>
              </nav>
          </div>
      </div>
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

    logoutUrl: function () {
      return '/vandringer/vandringer/' + this.walk.id
    }
  }
}
</script>

