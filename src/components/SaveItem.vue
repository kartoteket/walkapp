<template>
  <div id="saveItem">
    <header-component></header-component>

    <div role="main" class="webapp__content">
        <div>

          <div class="group" style="text-align: center;">
            <img v-show="imagePreview" :src="imagePreview" class="img-preview" width="100">
            <input id="fileInput" class="fileinput" :class="{ 'fileinput--small' : imagePreview }" type="file" v-on:change="uploadFile" accept="image/*" capture="camera">
            <label for="fileInput">
              <figure>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                    <path class="path1" d="M9.5 19c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5zM30 8h-7c-0.5-2-1-4-3-4h-8c-2 0-2.5 2-3 4h-7c-1.1 0-2 0.9-2 2v18c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-18c0-1.1-0.9-2-2-2zM16 27.875c-4.902 0-8.875-3.973-8.875-8.875s3.973-8.875 8.875-8.875c4.902 0 8.875 3.973 8.875 8.875s-3.973 8.875-8.875 8.875zM30 14h-4v-2h4v2z"></path>
                </svg>
              </figure>
              <span>{{fileInputButtonCaption}}</span>
            </label>
          </div>

          <div class="group form">
            <label class="item-desc">Beskrivelse</label>
            <textarea class="form__input" :value="message" @focus="scrollIntoView" @input="setMessage" placeholder="En kort og beskrivende forklaring."></textarea>
          </div>

          <div class="group">
            <label class="item-desc">Merkelapp(er)</label>
            <selector></selector>
          </div>

          <div class="group" v-if="position.address">
            <label class="item-desc">Adresse</label>
            <p>{{ position.address }} (<router-link :to="{ name: 'register'}">endre</router-link>)</p>
          </div>

        </div>
    </div>

    <footer-component
        :draft="draft"
        :submit="submit"
        :submitButtonCaption="submitButtonCaption"
        :showLogin="showLogin"
    ></footer-component>

  </div>
</template>

<script>
import Selector from './Selector'
import _ from 'lodash'
import animatedScrollTo from 'animated-scrollto'
import {mapState} from 'vuex'

export default {
  name: 'saveItem',

  components: { Selector },

  data: function () {
    return {
      imagePreview: null,
      hasFile: false,
      showLogin: false
    }
  },

  computed: {

    ...mapState({
      user: 'user',
      newItem: 'newItem',
      message: state => state.newItem.message,
      position: state => state.newItem.position,
      image: state => state.newItem.image,
      loading: state => state.loading
    }),

    draft: function () {
      return !(this.message && this.position) || false
    },

    fileInputButtonCaption: function () {
      console.log(this.previewImage)
      return this.imagePreview ? 'Endre bildet…' : 'Legg til et bilde…'
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

      if (this.message) {
        return 'Send inn!'
      }
      return 'Venter på beskrivelse…'
    },

    activeSession: function () {
      return true // fake it while in dev
      // return this.user && this.user.isCurrent
    }
  },

  watch: {

    image: function (val, oldVal) {
      this.createPreview()
    },

    activeSession: function () {
      var that = this
      var interval = this.showLogin ? 0 : 2000

      setTimeout(function () {
        that.showLogin = !that.activeSession
      }, interval)
    },

    // Attempting to dealy re-routing until save/load is complete. Not really perfect yet
    loading: function (val, oldVal) {
      if (oldVal) {
        this.$router.push({name: 'map'})
      }
    }
  },

  methods: {

    setMessage: function (e) {
      this.$store.commit('SET_MESSAGE', e.target.value)
    },

    setImage: function (file) {
      this.$store.commit('SET_IMAGE', file)
    },

    submit: function () {
      this.$store.commit('TOGGLE_LOADING')
      this.$store.dispatch('saveItem')
    },

    uploadFile: function (e) {
      var file = e.target.files && e.target.files.length ? e.target.files[0] : null
      if (file) {
        this.setImage(file)
      }
    },

    createPreview: function () {
      var that = this
      var reader = new FileReader()

      reader.addEventListener('load', function () {
        that.imagePreview = reader.result
      }, false)

      if (this.image) {
        reader.readAsDataURL(this.image)
      }
    },

    scrollIntoView: function (e) {
      var element = document.getElementsByClassName('webapp__content')[0]
      var target = element.offsetHeight - 20

      _.delay(animatedScrollTo, 400,
          element, // element to scroll with (most of times you want to scroll with whole <body>)
          target, // target scrollY (0 means top of the page)
          300, // duration in ms
          function () {
            console.log(target, element)
          }
      )
    },

    checkUser: function () {
      var interval = this.showLogin ? 1000 : 5000
      this.$store.dispatch('getUser')
      setTimeout(this.checkUser, interval)
    }
  },

  created: function () {
    // ping session to make sure we have a user
    // this.checkUser()
  },

  mounted: function () {
    if (this.image) {
      this.createPreview()
    }
  }
}
</script>

<style lang="scss">
  // ref: https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way/
  $higlight-color: #81766a; //$accent-color; //#d3394c;
  $accent-color:         #bc5731;
  $accent-color-dark:    darken($accent-color, 20%);

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

</style>
