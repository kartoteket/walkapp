<template>
  <div class="register">

    <header-component></header-component>

    <div role="main" class="webapp__content">
        <div id="funnmap" class="appmap" v-bind:class="{ 'appmap--short': editMode }"></div>

        <input id="js-pac-input" v-bind:class="{ hidden: selectMode }" class="controls pac-input" type="text" placeholder="Flytt på kartet eller søk etter en adresse">

        <div id="js-hiddenmarker" class="selectmarker"  v-bind:class="{ hidden: !editMode }" >
            <img src="https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png">
        </div>
    </div>

    <footer-component
        :readyToSubmit="readyToSubmit"
        :submitButtonCaption="submitButtonCaption"
        :selectLocation="selectLocation"
    ></footer-component>
  </div>
</template>

<script>
/* global google:true */
import _ from 'lodash'
import mixins from '../mixins'
import {mapGetters} from 'vuex'

export default {
  name: 'register',

  mixins: [mixins],

  data: function () {
    return {
      api_key: 'AIzaSyClPBnzKxMZpZXQmBTB-ZWjDN7XEL8ixN0',
      static_api_key: 'AIzaSyDc31zpEJWZrISadzSx1t3tgdVp4akh60c',
      selectMode: true,
      editMode: false,
      map: {},
      position: {},
      loading: true
    }
  },

  computed: {
    ...mapGetters([
      'walkId',
      'currentCoords',
      'mapConfig'
    ]),
    readyToSubmit: function () {
      return !this.currentCoords || false
    },
    submitButtonCaption: function () {
      return this.currentCoords ? 'Videre' : 'Venter på posisjon…'
    }
  },

  methods: {

    editLocation: function () {
      var that = this
      var staticMarker = document.getElementById('js-hiddenmarker')
      var input = document.getElementById('js-pac-input')
      var center = this.getMapCenter()

      // this.loading = false
      this.editMode = true
      this.selectMode = false

      // nextButton.style.display = 'block'

      staticMarker.style.position = 'absolute'
      // staticMarker.style.display = 'block'
      staticMarker.style.left = (center.x - (22 / 2)) + 'px'  // subtract half of marker width
      staticMarker.style.top = (center.y - (40 / 2)) + 'px'   // subtract half of marker height
      this.marker.setMap(null)

      this.searchBox = new google.maps.places.SearchBox(input, {bounds: this.map.getBounds()})
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)

      google.maps.event.addListener(this.searchBox, 'places_changed', function (e) {
        var places = that.searchBox.getPlaces()
        if (places.length) {
          // that.position = that.getAddress(position[0]) The panTo re-centers the map  whch triggers updateDragPosition()
          that.panTo(that.getAddress(places[0]))
        }
      })
      google.maps.event.addListener(this.map, 'center_changed', _.bind(this.updateDragPosition, this))
    },

    getMapCenter: function () {
      var div = this.map.getDiv()

      return {
        x: Math.round(div.clientWidth / 2),
        y: Math.round(div.clientHeight / 2)
      }
    },

    updateDragPosition: function () {
      var that = this
      var pos = this.map.getCenter().toJSON()
      var geocoder = new google.maps.Geocoder()
      var input = document.getElementById('js-pac-input')

      this.searchBox.setBounds(this.map.getBounds())

      geocoder.geocode({'location': pos}, function (results, status) {
        if (status === 'OK' && results.length) {
          // that.position = that.getAddress(results[0]) // this is always an aproximation
          that.position = pos // use the best most exact lat/lng we can get
          that.position.address = that.getAddress(results[0], 'address') // add address
          input.value = that.position.address
          // console.log(that.position.address)
        }
      })
    },

    selectLocation: function () {
      this.$store.commit('SET_POSITION', this.position)
      google.maps.event.clearInstanceListeners(this.map)
      this.$router.push({name: 'save'})
    },

    getAddress: function (result, property) {
      var pos = {
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng(),
        address: result.formatted_address
      }

      if (property) {
        return pos[property]
      }
      return pos
    },

    selectPosition: function () {
      var that = this
      var geocoder = new google.maps.Geocoder()
      var infoWindow
      var pos = {lat: this.currentCoords.latitude, lng: this.currentCoords.longitude}
      var mapElm = document.getElementById('funnmap')
      var mapOptions = {
        center: pos,
        zoom: this.mapConfig.zoomHigh - 2
      }

      // initalise map
      this.map = new google.maps.Map(mapElm, mapOptions)

      infoWindow = new google.maps.InfoWindow({map: this.map, enableEventPropagation: true})

      geocoder.geocode({'location': pos}, function (results, status) {
        if (status === 'OK') {
          // we are loaded
          that.loading = false

          if (results[0]) {
            that.position = that.getAddress(results[0])

            that.marker = new google.maps.Marker({
              position: that.position,
              map: that.map
            })

            // center map on marker. Gets paned a little bit after domready.
            that.zoomAndCenter(that.marker.getPosition(), that.mapConfig.zoomHigh)

            infoWindow.setContent(that.getInfoWindow())
            infoWindow.open(that.map, that.marker)

            // Wait for the infoWindow to be added before hookig up events
            google.maps.event.addListener(infoWindow, 'domready', function () {
              // cancel if user has navigated away before domready
              if (that.$store.state.route.name !== 'register') {
                return true
              }

              var edit = document.getElementsByClassName('js-infowindow-editlocation')
              // var sel = document.getElementsByClassName('js-infowindow-selectlocation')
              var infowindow = document.getElementsByClassName('infowindow')[0]

              // Move the map a little to the left and down
              if (infowindow) {
                that.map.panBy(infowindow.offsetWidth / -2, infowindow.offsetHeight / 2)
              }

              // edit location
              edit[0].addEventListener('click', function (e) {
                e.preventDefault()
                infoWindow.close()
                that.editLocation()
              })

              // select location
              // sel[0].addEventListener( 'click', function (e) {
              //   e.preventDefault()
              //   infoWindow.close()
              //   that.selectLocation()
              // })
            })
          } else {
            window.alert('No results found')
          }
        } else {
          window.alert('Geocoder failed due to: ' + status)
        }
      })
    },

    getInfoWindow: function (pos, results) {
      // var url = 'https://maps.googleapis.com/maps/api/staticmap?'
      // var params = ''
      var img = ''
      var header
      var footer

      // params += 'zoom=' + this.mapConfig.zoomHigh + 1
      // params += '&center=' + this.position.lat + ',' + this.position.lng
      // params += '&size=300x400'
      // params += '&markers=color:green%7Csize:mid%7C' + this.position.lat + ','+this.position.lng
      // params += '&key=' + this.static_api_key

      // img = '<img class="infowindow__img" src="' + url +  params  + '">'
      header = '<div class="infowindow__header"><h1>Er dette rett sted?</h1><h2>' + this.position.address + '</h2></div>'
      footer = '<div class="infowindow__footer">' +
               '<button class="button width-40% js-infowindow-editlocation">Nei, endre</button>'
               // + '<button class="button width-40% button--accent js-infowindow-selectlocation">Bruk</button></div>'

      return '<div class="infowindow">' + header + img + footer + '</div>'
    }
  },

  created: function () {
    // fetch Location
    if (!this.currentCoords) {
      this.$store.dispatch('getLocation')
    }
  },

  mounted: function () {
    var that = this

    // If position is pre-loaded, use position in map and trigger selectPosition, else select position when position is ready
    if (this.currentCoords) {
      this.selectPosition()
    } else {
      this.$watch('currentCoords', that.selectPosition)
    }
  }

}
</script>
