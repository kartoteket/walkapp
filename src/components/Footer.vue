<template>
  <div class="webapp__footer" v-if="walk">
      <template v-if="route === 'register'">
          <router-link class="button width-25%" :to="{ name: 'map'}">Tilbake</router-link>
<!--
          <button v-on:click="selectLocation" class="button button--primary" v-bind:class="{ 'button--disabled' : readyToSubmit }">{{ submitButtonCaption }}</button>
-->
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

  computed: {

    walk () {
      return this.$store.state.walk
    },

    walkId: function () {
      return this.$store.getters.walkId
    },

    route: function () {
      return this.$route.name
    },

    loginUrl () {
      return this.$store.state.config.rootUrl + '/vandringer/users/login'
    },

    // logoutUrl: function () {
    //   return '/vandringer/vandringer/' + this.walkId
    // },

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

<style lang="scss">
$mq-breakpoints: (
    mobile:  320px,
    tablet:  740px,
    desktop: 980px,
    wide:    1300px,

    // Tweakpoints
    mobilePlus: 420px
);
@import "~sass-mq/mq";

.webapp__footer {
  display: flex;
  justify-content: stretch;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60px;
  z-index: 2;

  @include mq($from: tablet) {
    height: 0;
  }

  > .button {
    flex: 1 1 100%;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 0;

    @include mq($from: tablet) {

      position: absolute;
      display: inline-block;
      height: auto;
      padding: 1.5rem 3rem;
      bottom: 60px;
      box-shadow: 0 4px 3px 0 rgba(0,0,0,0.24), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);
      &:nth-child(1) {
        left: 60px;
      }
      &:nth-child(2) {
        right: 60px;
      }
    }
  }
}
</style>
