<template>
  <div id="saveItem">
    <header-component></header-component>

    <div role="main" class="webapp__content">
        <div>

          <image-uploader
            :debug="true"
            :maxWidth="512"
            :quality="0.7"
            outputFormat="verbose"
            @input="setImage"></image-uploader>

          <div class="group form">
            <label class="item-desc">Beskrivelse</label>
            <textarea class="form__input" :value="message" @focus="scrollIntoView" @input="setMessage" placeholder="En kort og beskrivende forklaring."></textarea>
          </div>

          <div class="group">
            <label class="item-desc">Merkelapp(er)</label>
            <selector></selector>
          </div>

          <div class="group">
            <label class="item-desc">Prioritet</label>
            <div class="slider-wrapper slider">
              <range-slider
                class="slider"
                min="1"
                max="3"
                step="1"
                v-model="priority">
              </range-slider>
              <ol class="slider-labels slider">
                <li v-on:click="priority = 1">Lav</li>
                <li v-on:click="priority = 2">Middels</li>
                <li v-on:click="priority = 3">Høy</li>
              </ol>
            </div>
          </div>

          <div class="group" v-if="position.address">
            <label class="item-desc">Adresse</label>
            <p>{{ position.address }} (<router-link :to="{ name: 'register'}">endre</router-link>)</p>
          </div>

        </div>
    </div>

    <div v-if="loading" class="is-loading">
      <clip-loader :loading="loading" :size="spinnerSize"></clip-loader>
    </div>

    <footer-component
        :draft="draft"
        :submit="submit"
        :submitButtonCaption="submitButtonCaption"
        :showLogin="showLogin"
    ></footer-component>

    <!-- modal for error messages-->
    <sweet-modal ref="modal" blocking Xhide-close-button :icon=this.modal.type>
      <span slot="title">{{ this.modal.title }}</span>
      {{ this.modal.code }} - {{ this.modal.content }}

      <template slot="button" v-if="this.modal.code === 403">
        <button class="button button--primary" v-on:click="reload">
          Last siden på ny (omstart)
        </button>
        <a :href="loginUrl" target="_blank" class="button button--primary">
          Logg inn på ny
        </a>
      </template>
    </sweet-modal>

  </div>
</template>

<script>
import RangeSlider from 'vue-range-slider'
import Selector from './Selector'
import ImageUploader from './Imageuploader'
import _ from 'lodash/core'
import animatedScrollTo from 'animated-scrollto'
import {mapState} from 'vuex'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import { SweetModal } from 'sweet-modal-vue'

export default {
  name: 'saveItem',

  components: {
    Selector,
    ClipLoader,
    RangeSlider,
    ImageUploader,
    SweetModal
  },

  data: function () {
    return {
      showLogin: false,
      spinnerSize: '100px',
      priority: 2
    }
  },

  computed: {

    ...mapState({
      user: 'user',
      newItem: 'newItem',
      loading: 'loading',
      appMessage: 'appMessage',
      message: state => state.newItem.message,
      position: state => state.newItem.position,
      image: state => state.newItem.image,
      loginUrl: state => state.config.rootUrl + '/vandringer/users/login'
    }),

    draft: function () {
      return !(this.message && this.position) || this.loading || false
    },

    submitButtonCaption: function () {
      if (!this.position) {
        return 'Mangler posisjon…'
      }

      if (this.showLogin) {
        return 'Oops, du er logget ut.'
      }

      if (!this.activeSession) {
        return 'Vi sjekker tilgang...'
      }
      if (this.loading) {
        return 'Lagrer...'
      }
      if (this.message) {
        return 'Send inn!'
      }
      return 'Beskrivelse påkrevd'  // 'Venter på beskrivelse…'
    },

    modal: function () {
      return {
        type: this.appMessage.type,
        code: this.appMessage.code,
        title: this.appMessage.title,
        content: this.appMessage.body
      }
    },

    // TODO: Move to store ??!?
    activeSession: function () {
      // return true // fake it while in dev
      return this.user // && this.user.isCurrent <- We now test for this in the form-util and use gusetentryform if not current user
    }
  },

  watch: {

    priority: function (val) {
      this.setPriority()
    },

    activeSession: function () {
      this.modal.type = 'error'
      this.modal.code = 403
      this.modal.title = 'Vi har et problem!'
      this.modal.content = 'Vi får ikke verifisert brukeren din. Vennligst logg inn på ny.'
      this.$refs.modal.open()

      var that = this
      var interval = this.showLogin ? 0 : 2000

      setTimeout(function () {
        that.showLogin = !that.activeSession
      }, interval)
    }
  },

  methods: {

    setMessage: function (e) {
      this.$store.commit('SET_MESSAGE', e.target.value)
    },

    setImage: function (file) {
      this.$store.commit('SET_IMAGE', file)
    },

    setPriority: function () {
      this.$store.commit('SET_PRIORITY', this.priority)
    },

    submit () {
      this.$store.commit('TOGGLE_LOADING', true)
      this.$store.dispatch('saveItem').then(() => {
        this.$store.commit('TOGGLE_LOADING', false)
        this.$router.push({name: 'map'})
      }).catch(() => {
        this.$store.commit('TOGGLE_LOADING', false)
        this.$refs.modal.open()
      })
    },

    scrollIntoView: function (e) {
      var element = document.getElementsByClassName('webapp__content')[0]
      var target = element.offsetHeight - 20

      _.delay(animatedScrollTo, 400,
          element, // element to scroll with (most of times you want to scroll with whole <body>)
          target, // target scrollY (0 means top of the page)
          300, // duration in ms
          function () {
            // console.log(target, element)
          }
      )
    },

    checkUser: function () {
      var interval = this.showLogin ? 1000 : 5000
      this.$store.dispatch('getUser')
      setTimeout(this.checkUser, interval)
    },

    reload () {
      location.reload()
    }
  },

  created: function () {
    this.$store.commit('TOGGLE_LOADING', false)

    // ping session to make sure we have a user
    // this.checkUser()
  }
}
</script>

<style lang="scss">

  // ref: https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/

  $higlight-color:       #81766a; //$accent-color; //#d3394c;
  $accent-color:         #bc5731;
  $accent-color-dark:    darken($accent-color, 20%);

  $slider-width: 200px;
  $rail-height: 4px;
  $knob-size: 20px;

  $rail-color: #e2e2e2;
  $rail-fill-color: #f59e22;
  $knob-color: $rail-fill-color;

  $knob-border: 1px solid darken($rail-fill-color, 2%);
  $knob-shadow: 1px 1px rgba(0, 0, 0, 0.2);


  $mq-breakpoints: (
      mobile:  320px,
      tablet:  740px,
      desktop: 980px,
      wide:    1300px,

      // Tweakpoints
      mobilePlus: 420px
  );

  @import "~sass-mq/mq";
  @import "~vue-range-slider/dist/vue-range-slider";

  // sweet modal overrides
  .sweet-modal {
    .sweet-box-actions .sweet-action-close:hover {
      background-color: #f59e22 !important;
    }
  }

  .fileinput {

      position: absolute;
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      z-index: -1;

      & + label {
          max-width: 80%;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 700;
          color: $higlight-color;
          cursor: pointer;
          display: inline-block;
          overflow: hidden;
          padding: 0.625rem 1.25rem;

          figure {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              background-color: $higlight-color;
              display: block;
              padding: 20px;
              margin: 0 auto 10px;
          }

          svg {
              width: 100%;
              height: 100%;
              vertical-align: middle;
              fill: currentColor;
              margin-top: -0.25em;
              margin-right: 0.25em;
              fill: #f1e5e6;
          }

          &:hover {
              color: $accent-color-dark;
              figure {
                  background-color: $accent-color-dark;
              }
          }

          * {
              pointer-events: none;
          }
      }

      &:focus + label {
          outline: 1px dotted #000;
          outline: -webkit-focus-ring-color auto 5px;
      }

      // small when a file is selected
      &--small + label {
          figure {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              background-color: $higlight-color;
              display: inline-block;
              padding: 10px;
              margin: 10px;

          }
      }

  }

  .img-preview {
      display: block;
      width: 100%;
      max-width: 450px;
      max-height: 300px;
      margin: 0 auto;
      border: 5px solid $higlight-color;
  }

  .item-desc {
      font-weight: 700;
      color: $higlight-color;
  }

  .webapp__content {

    .form__input,
    .multiselect__tags {
      border-radius: 3px;
      border-color: #81766a
    }

    .multiselect__tag,
    .multiselect__option--highlight:after,
    .multiselect__option--highlight {
      background-color: lighter(#009688, 10%);
    }
}

  .slider {

      &.range-slider {
        @include mq($until: mobilePlus) {
          width: 100%;
        }
      }


      &.slider-labels {
        display: flex;
        justify-content: space-between;
        width: 100%;
        list-style: none;
        line-height: 1;

        @include mq($from: mobilePlus) {
          width: $slider-width;
        }

        > li {
            position: relative;
            display: inline-block;
            font-size: .7rem;
            &:hover {
              cursor: pointer;
            }
        }
      }
  }



</style>
