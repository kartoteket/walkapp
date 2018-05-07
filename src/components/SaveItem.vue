<template>
  <div id="saveItem">
    <header-component></header-component>

    <div role="main" class="webapp__content">
        <div>

          <div class="group" style="text-align: center;">

            <image-uploader
              :debug="imgConfig.debug"
              :maxWidth="imgConfig.maxWidth"
              :quality="imgConfig.quality"
              :autoRotate="imgConfig.autoRotate"
              :outputFormat="imgConfig.outputFormat"
              :className="['fileinput', { 'fileinput--small' : imagePreview }]"
              @input="setImage"
              @onUpload="startImageResize"
              @onComplete="endImageResize">
                  <label for="fileInput" slot="upload-label">
                    <figure>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                          <path class="path1" d="M9.5 19c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5zM30 8h-7c-0.5-2-1-4-3-4h-8c-2 0-2.5 2-3 4h-7c-1.1 0-2 0.9-2 2v18c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-18c0-1.1-0.9-2-2-2zM16 27.875c-4.902 0-8.875-3.973-8.875-8.875s3.973-8.875 8.875-8.875c4.902 0 8.875 3.973 8.875 8.875s-3.973 8.875-8.875 8.875zM30 14h-4v-2h4v2z"></path>
                      </svg>
                    </figure>
                    <span class="upload-caption">{{fileInputButtonCaption}}</span>
                  </label>
              </image-uploader>
          </div>

          <div class="group form">
            <label class="item-desc">Beskrivelse</label>
            <textarea class="form__input" :value="message" @focus="scrollIntoView" @input="setMessage" placeholder="En kort og beskrivende forklaring."></textarea>
          </div>

          <div class="group" v-if="enableTags">
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

<!--
          <div class="group" v-if="position.address">
            <label class="item-desc">Adresse</label>
            <p>{{ position.address }} (<router-link :to="{ name: 'register'}">endre</router-link>)</p>
          </div>
-->
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
    <modal ref="modal"></modal>

  </div>
</template>

<script>
import RangeSlider from 'vue-range-slider'
// import Selector from './Selector'
import { ImageUploader } from 'vue-image-upload-resize'
// import ImageUploader from './Imageuploader'
import _ from 'lodash/core'
import animatedScrollTo from 'animated-scrollto'
import {mapState} from 'vuex'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

export default {
  name: 'saveItem',

  components: {
    // Selector,
    'Selector': () => import(/* webpackChunkName: "tag-selector" */ './Selector'),
    'Modal': () => import(/* webpackChunkName: "modal" */ './Modal'),
    ClipLoader,
    RangeSlider,
    ImageUploader
  },

  data: function () {
    return {
      showLogin: false,
      spinnerSize: '100px',
      priority: 2,
      imagePreview: null
    }
  },

  computed: {

    ...mapState({
      user: 'user',
      newItem: 'newItem',
      loading: 'loading',
      message: state => state.newItem.message,
      position: state => state.newItem.position,
      image: state => state.newItem.image,
      imgConfig: state => state.config.imgConfig,
      enableTags: state => state.config.enableTags
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

      if (this.loading) {
        return 'Lagrer...'
      }
      if (this.message) {
        return 'Send inn!'
      }
      return 'Beskrivelse påkrevd'  // 'Venter på beskrivelse…'
    },

    fileInputButtonCaption: function () {
      return this.imagePreview ? 'Endre bildet…' : 'Legg til et bilde…'
    }
  },

  watch: {
    priority: function (val) {
      this.setPriority()
    }
  },

  methods: {

    setMessage: function (e) {
      this.$store.commit('SET_MESSAGE', e.target.value)
    },

    setImage: function (file) {
      this.imagePreview = this.imgConfig.outputFormat === 'verbose' ? file.dataUrl : file
      this.$store.commit('SET_IMAGE', file)
    },

    startImageResize () {
      this.$store.commit('TOGGLE_LOADING', true)
    },

    endImageResize () {
      this.$store.commit('TOGGLE_LOADING')
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
    }
  },

  created: function () {
    this.$store.commit('TOGGLE_LOADING', false)

    // ping session to make sure we have a user
    this.$store.dispatch('getUser')
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
