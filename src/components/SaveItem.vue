<template>
  <div class="saveItem">
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

            <div class="group">
                <label class="item-desc">Legg til en beskrivelse</label>
                <textarea :value="message" @focus="scrollIntoView" @input="setMessage" placeholder="En kort og beskrivende forklaring."></textarea>
            </div>

            <div class="group" v-if="position.address">
                <label class="item-desc">Adresse</label>
                <p>{{ position.address }} (<router-link :to="{ name: 'register'}">endre</router-link>)</p>
            </div>

        <!--
            <div class="group">
                <label>Legg til merkelapp</label>
                <button class="button" v-on:click="addTag">Ny...</button>
                <select v-selectize="selected">
                    <option value="one">Static item 1</option>
                    <option value="two">Static item 2</option>
                    <option value="three">Static item 3</option>
                </select>
            </div>
        -->
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

import _ from 'lodash'
import animatedScrollTo from 'animated-scrollto'

import {mapState} from 'vuex'

export default {
  name: 'saveItem',

  data: function () {
    return {
      // localMessage: this.message,
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

    // position: function () {
    //   return this.newItem.position
    // },
    // message: function () {
    //   return this.message
    // },

    draft: function () {
      return !(this.message && this.position) || false
    },

    fileInputButtonCaption: function () {
      return this.previewSrc ? 'Endre bildet…' : 'Legg til et bilde…'
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
      return true // fake it
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

    // Attempting to dealy re-routing until save/load is complete. Nt really perfect yet
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

    setTags: function () {
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

      console.log('createPreview is triggered')

      reader.addEventListener('load', function () {
        that.imagePreview = reader.result
        // console.log(that.imagePreview)
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
