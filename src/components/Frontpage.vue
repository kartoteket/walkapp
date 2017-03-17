<template>
  <div id="frontpage">

      <header-component></header-component>

      <div role="main" class="webapp__content" :class="{ 'center-content' : !walkId }" >
          <div class="gutter-half--top" v-if="walkId">
              <div class="group">
                  <h1>{{ walk.title }}</h1>
                  <p class="fp-description">{{ walk.description }}</p>
              </div>

              <div class="group row" v-show="itemsCount > 1">
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
          <div class="gutter-half--top" v-else>
              <div class="group form">
                  <h1>Skriv inn vandringens kode</h1>
                  <form @submit.prevent="submit" class="gutter-half--top">
                    <input v-model="id" type="text" class="text--center">
                    <button type="submit" class="button button--primary gutter-half--top">Start!</button>
                  </form>
              </div>
          </div>
      </div>

      <footer-component></footer-component>
  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'frontpage',

  data: () => {
    return {
      id: null
    }
  },

  computed: {
    walkId: function () {
      return this.$store.getters.walkId
    },
    ...mapState([
      'walk'
    ]),
    ...mapGetters([
      'itemsCount',
      'prettyDate'
    ])
  },
  methods: {
    submit: function () {
      this.$router.replace({name: 'frontpage', params: { walk_id: this.id }})
      this.$store.dispatch('initApp')
    }
  }
}
</script>

