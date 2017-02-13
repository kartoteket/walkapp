<template>
  <div id="app">
    <router-view class="webapp"
        :config="config"
        :state="state"
        :vandring="vandring"
        :items="items"
        :user="user"
        :map="map"
        :position="position"
        :currentPosition="currentPosition"
        :message="message"
        :previewImg="previewImg">
    </router-view>
  </div>
</template>

<script>

import _ from 'lodash'
import axios from 'axios'
import mixins from './mixins'

export default {

  name: 'app',

  mixins: [mixins],

  // props: ['walkId'],

  data: function () {
    return {
      // walkId: this.$route.params.walk_id,
      state: 'frontpage', // possible = funn | welcome | setlocation | frontpage | visfunn
      position: {
        address: 'Trondheimsveien 4, 0561 Oslo, Norway',
        lat: 59.9189238,
        lng: 10.762951199999975
      },
      map: {},
      currentPosition: {},
      message: '',
      previewImg: null,
      vandring: {},
      items: [],
      user: {},
      openMenu: false,
      config: {
        // itemsSectionId: 8,
        // mapConfig: {
        //   zoomBase: 10,
        //   zoomLow: 5,
        //   zoomHigh: 20
        // },
        // geoConfig: {
        //   maximumAge: 5 * 60 * 1000,
        //   timeout: 10 * 1000,
        //   enableHighAccuracy: true
        // }
      }
    }
  },

  computed: {

    walkId: function () {
      return this.$store.getters.walkId
    }
    // itemsCount: function () {
    //   return Math.max(this.vandring.itemsCount, this.items.length)  // to save a request we use either the return value from the API (initially, or the incrementet vaue from items if new items have been added)
    // },
    // logoutUrl: function () {
    //   return '/vandringer/vandringer/' + this.walkId
    // }
  },

  methods: {

    // setState: function (state) {
    //   this.state = state
    // },
    setPosition: function (pos) {
      this.position = pos
    },
    setCurrentPosition: function (pos) {
      this.currentPosition = pos
      // this.setPosition(pos)      //TODO: merge these? Or rename...
    },
    setImage: function (image) {
      this.image = image
    },
    setPreviewImg: function (previewImg) {
      this.previewImg = previewImg
    },
    setMessage: function (message) {
      this.message = message
    },
    setWalk: function (walk) {
      this.vandring = walk
    },
    setItems: function (items) {
      this.items = items
    },
    setUser: function (user) {
      this.user = user
    },

    saveFunn: function () {
      var that = this
      var form = new FormData()

      var saveSuccess = function (response) {
        // correctly format position. TODO: either make this a util or edit API to output in the correct format
        response.data.position = {'lat': +response.data.position[0], 'lng': +response.data.position[1]}

        // update items array in app cache
        if (_.isArray(that.items)) {
          that.items.unshift(response.data)
        }

        // highlight and resets
        this.$store.commit('TOGGLE_HIGHLIGHT_FIRST') // TODO TEST THIS
        that.message = ''
        that.previewImg = ''

        that.$router.push({ name: 'Map' })
      }

      var saveError = function (error) {
        if (error.response) {
          // The request was made, but the server responded with a status code that falls out of the range of 2xx
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
        }
        console.log(error.config)
      }

      form.append('action', 'entries/saveEntry')
      form.append('redirect', 'api/walks/items/{id}.json') // Craft autoinjects the entryID... nice, he ?
      form.append('locale', 'no')
      form.append('enabled', '1')

      form.append('sectionId', that.config.itemsSectionId)
      form.append('fields[walk_item_parent][]', this.walkId)
      form.append('fields[walk_item_priority]', 'high')

      if (this.message) {
        form.append('fields[walk_item_description]', this.message)
      }

      if (this.position.address) {
        form.append('fields[walk_item_location][line1]', this.position.address)
      }

      if (this.position.lat && this.position.lng) {
        form.append('fields[walk_item_location][latitude]', this.position.lat)
        form.append('fields[walk_item_location][longitude]', this.position.lng)
      }

      if (this.image) {
        form.append('fields[walk_item_photo]', this.image)
      }

      var data
      data[window.csrfTokenName] = window.csrfTokenValue

      axios.post('/vandringer/funn/ny/', form).then(saveSuccess).catch(saveError)
    }
  },

  created: function () {
    // this.getUser()
    // this.getWalk()
    // this.getLocation()
    // this.getItems()

    if (this.walkId) {
      this.$store.dispatch('initApp')
    }

    // this.$store.dispatch('saveItem')

    this.$on('saveFunn', this.saveFunn)
    this.$on('setState', this.setState)
    this.$on('setImage', this.setImage)
    this.$on('setMessage', this.setMessage)
    this.$on('setItems', this.setItems)
    this.$on('setWalk', this.setWalk)
    this.$on('setUser', this.setUser)
    this.$on('setPosition', this.setPosition)
    this.$on('setCurrentPosition', this.setCurrentPosition)
    this.$on('setPreviewImg', this.setPreviewImg)
  }
}
</script>

<style>
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
}
</style>
