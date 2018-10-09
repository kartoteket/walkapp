<template>
    <sweet-modal ref="modal" :blocking="modal.blocking ? '' : null" :hide-close-button="modal.blocking ? '' : null" :icon="modal.type">
      <span slot="title">{{ modal.title }}</span>

      {{ modal.content }}

      <div class="errors" v-if="errors">
        {{ errors }}
      </div>

      <div v-if="modal.code === 666 ">
        <button class="button button--primary" v-on:click="close">
          Lukk
        </button>
      </div>


      <div v-if="modal.code === 403 || modal.code === 401">

        <form accept-charset="UTF-8" @submit.prevent="doLogin" class="form">

            <input type="hidden" :name="csrfName" :value="csrfToken">

            <div class="form__block">
              <label for="loginName">E-post</label>
              <input id="loginName" type="text" name="loginName" v-model="theUser.loginName">
            </div>

            <div class="form__block">
              <label for="password">Passord</label>
              <input id="password" type="password" name="password" v-model="theUser.password">
            </div>

            <div class="form__block">
              <button type="submit" class="button">Login</button>
              <button type="submit" class="button" v-on:click="close">Avbryt</button>
            </div>

          </form>
      </div>

      <template slot="button" v-if="modal.code === 403 || modal.code === 401">
<!--
        <button class="button button--primary" v-on:click="reload">
          Last siden på ny (omstart)
        </button>
        <a :href="loginUrl" target="_blank" class="button button--primary">
          Logg inn på ny
        </a>
-->
      </template>
    </sweet-modal>
</template>

<script>
import { SweetModal } from 'sweet-modal-vue'
export default {
  name: 'modal-component',

  components: {
    SweetModal
  },

  data: function () {
    return {
      theUser: {
        loginName: null,
        password: null,
        action: 'users/login'
      },
      errors: null,
      message: null
    }
  },

  computed: {
    appMessage () {
      return this.$store.state.appMessage
    },

    // loginUrl () {
    //   return this.$store.state.config.rootUrl + '/vandringer/users/login'
    // },

    modal () {
      return {
        type: this.appMessage.type,
        code: this.appMessage.code,
        title: this.appMessage.title,
        content: this.appMessage.body,
        blocking: this.appMessage.code === 401
      }
    },

    csrfName () {
      return window.csrfTokenName
    },

    csrfToken () {
      return window.csrfTokenValue
    }

  },

  methods: {
    open () {
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
      this.$store.commit('TOGGLE_LOADING', false)
    },
    reload () {
      location.reload()
    },

    doLogin () {
      const vm = this
      this.$store.commit('TOGGLE_LOADING', true)
      this.$store.dispatch('loginUser', this.theUser).then((response) => {
        if (response.data.success) {            // if login succeeds:
          vm.$store.dispatch('getUser')         // 1) get the User and save to store
          vm.$store.commit('APP_MESSAGE', {})   // 2) resett app message
          vm.close()                            // 3) close modal
        }
        if (response.data.error) {
          this.errors = response.data.error
        }
        vm.$store.commit('TOGGLE_LOADING', false)
      }).catch((error) => {
        // console.log(error)
        this.errors = error
        this.$store.commit('TOGGLE_LOADING', false)
      })
    }
  }
}
</script>

<style lang="scss">
// sweet modal overrides
.sweet-modal {

  .sweet-content {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .sweet-box-actions .sweet-action-close:hover {
    background-color: #f59e22 !important;
  }

  .sweet-modal-icon {
    margin-bottom: 1rem;
    // float: left;
  }
}

.form__block {

  text-align: left;

  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    display: block;
    width: 100%;
    padding: 0.625rem;
    border: 1px solid #000;
    border-radius: 0;
    color: #000;
    font-size: 0.8125rem;
    -webkit-font-smoothing: antialiased;
    // vertical-align: middle;
  }
}

</style>
