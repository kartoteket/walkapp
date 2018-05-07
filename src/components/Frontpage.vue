<template>
  <div id="frontpage">

      <header-component></header-component>

      <template v-if="walk" >

        <div role="main" class="webapp__content center-content" v-if="itemsCount < 1">
          <div v-if="user.isCurrent">
            <label>Hei</label>
            <h2>{{user.name}}</h2>
            <p>&nbsp;</p>
            <label>Velkommen til vandringen</label>
            <h1>{{walk.title}}</h1>
            <br>
          </div>
        </div>

        <div role="main" class="webapp__content" v-else >
          <div class="gutter-half--top">

            <div class="group">
              <h1>{{ walk.title }}</h1>
              <p class="fp-description">{{ walk.description }}</p>
            </div>

            <div class="group row">
              <div class="col">
                <router-link class="dashboard__item dashboard__item--accent" :to="{ name: 'map'}">
                  <span class="dashboard__count">{{ itemsCount }}</span>
                  <label class="dashboard__label">Funn</label>
                </router-link>
              </div>

              <div class="col">
                <div class="dashboard__item">
                  <span class="dashboard__count">{{walk.participantsCount}}</span>
                  <label class="dashboard__label">Deltakere</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div class="webapp__content center-content" v-else>
          <div v-if="!this.loading">
            <div class="group form">
                <h1>Skriv inn vandringens kode</h1>
                <form @submit.prevent="submit" class="gutter-half--top">
                  <input v-model="id" type="text" class="text--center">
                  <button type="submit" class="button button--primary gutter-half--top">Start!</button>
                </form>
            </div>
            <div class="group" v-if="notFound">
              Koden virker ikke. Prøv igjen?
            </div>
          </div>
      </div>

      <div  v-if="loading" class="is-loading">
        <clip-loader :loading="loading" :size="spinnerSize"></clip-loader>
      </div>


      <footer-component></footer-component>
  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

export default {
  name: 'frontpage',

  components: {
    ClipLoader
  },

  data: () => {
    return {
      id: this.walkId,
      spinnerSize: '100px',
      notFound: false
    }
  },

  computed: {
    walkId: function () {
      return this.$store.getters.walkId
    },
    ...mapState([
      'user',
      'walk',
      'loading'
    ]),
    ...mapGetters([
      'itemsCount',
      'prettyDate'
    ])
    // notFound: function () {
    //   debugger
    //   console.log(!this.loading && this.walkId && !this.walk)
    //   return !this.loading && this.walkId && !this.walk
    // }
  },

  watch: {
    // a good time to know all is loaded
    itemsCount: function (val, oldVal) {
      this.$store.commit('TOGGLE_LOADING', false)
    }
  },

  methods: {
    submit () {
      this.$store.commit('TOGGLE_LOADING', true)

      const id = isNaN(this.id) ? window.atob(this.id) : this.id

      this.$store.dispatch('getWalk', id).then(() => {
        this.$router.replace({name: 'frontpage', params: { walk_id: id }})
        this.$store.dispatch('initApp')
        // this.$store.commit('TOGGLE_LOADING', false)
      }).catch(() => {
        this.$store.commit('TOGGLE_LOADING', false)
        this.notFound = true
      })
    }
  },

  created: function () {
    // this.$store.commit('TOGGLE_LOADING', true)
  },

  mounted () {
    this.id = this.walkId     // use this to pass any id in the URL as default value to input

    // no walk, turn of loading to show input form
    if (!this.id) {
      this.$store.commit('TOGGLE_LOADING', false)
    }
  }
}
</script>

