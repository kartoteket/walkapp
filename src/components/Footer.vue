<template>
  <div class="webapp__footer" v-if="walkId">
      <template v-if="route === 'register'">
          <router-link class="button width-25%" :to="{ name: 'map'}">Tilbake</router-link>
          <button v-on:click="selectLocation" class="button button--primary" v-bind:class="{ 'button--disabled' : readyToSubmit }">{{ submitButtonCaption }}</button>
      </template>

      <template v-else-if="route === 'save'">
          <div class="webapp__footer">
              <router-link class="button width-25%" :to="{ name: 'register'}">Tilbake</router-link>
              <button v-on:click.prevent="submit" class="button button--primary" v-bind:class="{ 'button--disabled' : draft }">
                  {{ submitButtonCaption }}
              </button>
              <a v-if="showLogin" :href="loginUrl" target="_blank" class="button button--primary">Logg inn på ny</a>
          </div>
      </template>

      <template v-else v-for="btn in buttons">
          <a v-if="btn.external" :href="btn.target" class="button" :class="btn.class">{{ btn.label }}</a>
          <router-link v-else :to="btn.target" class="button" :class="btn.class">{{ btn.label }}</router-link>
      </template>
  </div>
</template>

<script>
export default {
  name: 'footer-component',

  props: ['readyToSubmit', 'submitButtonCaption', 'selectLocation', 'draft', 'submit', 'showLogin'],

  data: function () {
    return {
      loginUrl: '/vandringer/users/login'
    }
  },

  // created: function () {
  //   alert('xxx')
  // },
  //
  computed: {

    walkId: function () {
      return this.$store.getters.walkId
    },

    route: function () {
      return this.$route.name
    },

    logoutUrl: function () {
      return '/vandringer/vandringer/' + this.walkId
    },

    buttons: function () {
      var buttons = {
        // 'welcome': [
        //   {
        //     target: this.logoutUrl,
        //     label: 'Avslutt',
        //     class: 'width-25%',
        //     external: true
        //   },
        //   {
        //     target: {name: 'frontpage', param: {walk_id: this.walkId}},
        //     label: 'Start!',
        //     class: 'button--primary button--wide'
        //   }
        // ],
        'frontpage': [
          {
            target: {name: 'map'},
            label: 'Vis funn i kart'
          },
          {
            target: {name: 'register'},
            label: 'Registrer funn',
            class: 'button--primary'
          }
        ],
        'map': [
          {
            target: {name: 'frontpage'},
            label: 'Tilbake'
          },
          {
            target: {name: 'register'},
            label: 'Registrer nytt funn',
            class: 'button--primary width-75%'
          }
        ]
      }
      return buttons[this.route]
    }
  }
}
</script>
