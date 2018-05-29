<template>
  <div class="register">

    <header-component></header-component>

    <div role="main" class="webapp__content">
        <div id="registermap" class="appmap appmap--short"></div>

        <input id="js-pac-input" v-bind:class="{ hidden: selectMode }" class="controls pac-input" type="text" placeholder="Flytt på kartet eller søk etter en adresse">

        <div id="js-hiddenmarker" class="selectmarker" v-show="editMode" v-tooltip.top-center="{ content: postionInfo, show: editMode }">
          <img src="../assets/img/hair-cross.svg" alt="">
        </div>
    </div>

    <!-- <div  v-if="loading" class="is-loading">
      <clip-loader :loading="loading" :size="spinnerSize"></clip-loader>
    </div> -->


    <footer-component
        :readyToSubmit="readyToSubmit"
        :submitButtonCaption="submitButtonCaption"
        :selectLocation="selectLocation"
    ></footer-component>
  </div>
</template>

<script>
/* global google:true */
import _ from 'lodash/core'
// import mapStyle from '../assets/json/silver.json'
import {mapGetters, mapState} from 'vuex'
import { VTooltip } from '../../../vue-tooltip'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

VTooltip.options = {
  defaultClass: 'tooltip-theme-arrows',
  openOn: 'null'
}

export default {
  name: 'register',

  components: {
    ClipLoader
  },

  data: function () {
    return {
      api_key: 'AIzaSyClPBnzKxMZpZXQmBTB-ZWjDN7XEL8ixN0',
      static_api_key: 'AIzaSyDc31zpEJWZrISadzSx1t3tgdVp4akh60c',
      selectMode: true,
      editMode: false,
      map: {},
      position: this._position || {},
      spinnerSize: '100px',
      loading: true
    }
  },

  directives: {
    tooltip: VTooltip
  },

  computed: {
    ...mapGetters([
      'walkId',
      'currentCoords',
      'mapConfig',
      'geoConfig'
    ]),
    ...mapState({
      _position: state => state.newItem.position,
      locationStatus: state => state.locationStatus
      // loading: state => state.loading
    }),
    readyToSubmit: function () {
      return !this.currentCoords || false
    },
    submitButtonCaption: function () {
      return this.currentCoords ? 'Videre' : 'Venter…' // 'Venter på posisjon…'
    },
    postionInfo: function () {
      return this.getInfoWindow()
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
      // staticMarker.style.left = (center.x - (20 / 2)) + 'px'  // subtract half of marker width
      // staticMarker.style.top = (center.y - (22 / 2)) + 'px'   // subtract half of marker height
      staticMarker.style.left = (center.x - 28) + 'px'  // adjusted by calibration
      staticMarker.style.top = (center.y + 6) + 'px'   // adjusted by calibration
      this.marker.setMap(null)

      if (input) {
        this.searchBox = new google.maps.places.SearchBox(input, {bounds: this.map.getBounds()})
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)

        google.maps.event.addListener(this.searchBox, 'places_changed', function (e) {
          var places = that.searchBox.getPlaces()
          if (places.length) {
            that.map.panTo(that.getAddress(places[0]))
          }
        })
      }

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
      var calibrate = false

      // DEBUG MAP CENTER MARKER POSITION. FOR CALIBRATION OF HIDDEN MARKER
      if (calibrate) {
        var icon = {
          path: 'M10 0.4c-5.303 0-9.601 4.298-9.601 9.6 0 5.303 4.298 9.601 9.601 9.601 5.301 0 9.6-4.298 9.6-9.601s-4.299-9.6-9.6-9.6zM11 17.525v-4.525h-2v4.525c-3.396-0.446-6.080-3.129-6.527-6.525h4.527v-2h-4.527c0.447-3.396 3.131-6.079 6.527-6.525v4.525h2v-4.525c3.394 0.447 6.078 3.13 6.525 6.525h-4.525v2h4.525c-0.447 3.394-3.131 6.078-6.525 6.525z',
          fillColor: '#2ca286',
          fillOpacity: 1,
          anchor: new google.maps.Point(12, 32),
          strokeWeight: 0,
          scale: 1.75
        }

        var marker = new google.maps.Marker({
          position: pos,
          map: this.map,
          icon: icon
        })
        console.log(marker)
      }

      if (this.searchBox) {
        this.searchBox.setBounds(this.map.getBounds())
      }

      geocoder.geocode({'location': pos}, function (results, status) {
        if (status === 'OK' && results.length) {
          // that.position = that.getAddress(results[0]) // this is always an aproximation
          that.position = pos // use the best most exact lat/lng we can get
          that.position.address = that.getAddress(results[0], 'address') // add address
          if (input) {
            input.value = that.position.address
          }
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
      var pos = this.currentCoords
      var mapElm = document.getElementById('registermap')
      var mapOptions = {
        center: pos,
        zoom: this.mapConfig.zoomBase,
        gestureHandling: this.mapConfig.gesture,
        fullscreenControl: this.mapConfig.fullscreenControl,
        clickableIcons: false
        // styles: mapStyle
      }
      var icon = {
        path: 'M10 0.4c-5.303 0-9.601 4.298-9.601 9.6 0 5.303 4.298 9.601 9.601 9.601 5.301 0 9.6-4.298 9.6-9.601s-4.299-9.6-9.6-9.6zM11 17.525v-4.525h-2v4.525c-3.396-0.446-6.080-3.129-6.527-6.525h4.527v-2h-4.527c0.447-3.396 3.131-6.079 6.527-6.525v4.525h2v-4.525c3.394 0.447 6.078 3.13 6.525 6.525h-4.525v2h4.525c-0.447 3.394-3.131 6.078-6.525 6.525z',
        fillColor: '#bc5731',
        fillOpacity: 1,
        anchor: new google.maps.Point(12, 32),
        strokeWeight: 0,
        scale: 1.5
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
              map: that.map,
              icon: icon
            })

            // center map on marker. Gets paned a little bit after domready.
            that.map.setCenter(that.position)
            that.map.setZoom(that.geoConfig.enabled ? mapOptions.zoom : mapOptions.zoom - 10) // if no peo positioning, zoom out

            infoWindow.setContent(that.getInfoWindow())
            infoWindow.open(that.map, that.marker)

            // Wait for the infoWindow to be added before hookig up events
            google.maps.event.addListener(infoWindow, 'domready', function () {
            // cancel if user has navigated away before domready
              if (that.$store.state.route.name !== 'register') {
                return true
              }

              // Move the map a little to the left and down
              const infowindow = document.getElementsByClassName('infowindow')[0]
              if (infowindow) {
                that.map.panBy(infowindow.offsetWidth / -2, infowindow.offsetHeight / 2)
              }

              // click handlers
              document.addEventListener('click', function (e) {
              // trigger get location
              // NOT YET IN USE: A button to have the user position him/herself
              // if (e.target.classList.contains('js-infowindow--getlocation')) {
              //   that.$store.commit('TOGGLE_LOADING', true)
              //   that.$store.dispatch('getLocation')
              // }

              // edit location
                if (e.target.classList.contains('js-infowindow--editlocation')) {
                  infoWindow.close()
                  that.editLocation()
                }

                // select location
                if (e.target.classList.contains('js-infowindow--selectlocation')) {
                  that.selectLocation()
                }
              })
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
      let img = ''
      let header
      let footer
      let streetAddress = ''

      if (this.position.address) {
        streetAddress = this.position.address.split(', ')[0]
      }

      // params += 'zoom=' + this.mapConfig.zoomHigh + 1
      // params += '&center=' + this.position.lat + ',' + this.position.lng
      // params += '&size=300x400'
      // params += '&markers=color:green%7Csize:mid%7C' + this.position.lat + ','+this.position.lng
      // params += '&key=' + this.static_api_key

      // img = '<img class="infowindow__img" src="' + url +  params  + '">'
      header = '<div class="infowindow__header"><h1>' +
      (this.selectMode ? this.locationStatus + ':' : 'Flytt på kartet for å velge sted') +
      '</h1><h2 title="' + this.position.address + '">' + streetAddress + '</h2></div>'
      footer = '<div class="infowindow__footer">' +
               (this.selectMode ? '<button class="button width-50% js-infowindow js-infowindow--editlocation gutter-half--right">' + (this.geoConfig.enabled ? 'Nei, endre' : 'Velg manuelt') + '</button>' : '') +
               (this.geoConfig.enabled || this.editMode ? '<button class="button width-50% button--primary js-infowindow js-infowindow--selectlocation" >Ja,&nbsp;fortsett</button>' : '') +
               '</div>'

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

<style lang="scss">

$tooltip_color: #fff;
$tooltip_arrow_size: 10px;

// Quick fix to remove close button on infowindw
#registermap .gm-style-iw + div {
  display: none;
  pointer-events: none;
}


.tooltip {
  display: none;
  opacity: 0;
  transition: opacity .15s;
  padding: 4px;
  z-index: 4;
}

.tooltip .tooltip-content {
  background: $tooltip_color;
  color: white;
  padding: 5px 10px 4px;
  box-shadow: 0 4px 3px 0 rgba(0,0,0,0.06), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);
}

.tooltip.tooltip-open-transitionend {
  display: block;
}

.tooltip.tooltip-after-open {
  opacity: 1;
}

.tooltip-element, .tooltip-element:after, .tooltip-element:before, .tooltip-element *, .tooltip-element *:after, .tooltip-element *:before {
  box-sizing: border-box;}

.tooltip-element {
  position: absolute;
  display: none;
}

.tooltip-element.tooltip-open {
  display: block;
}

.tooltip-element.tooltip-theme-arrows {
  max-width: 100%;
  max-height: 100%;
}

.tooltip-element.tooltip-theme-arrows .tooltip-content {
  border-radius: 5px;
  position: relative;
  font-family: inherit;
  background: $tooltip_color;
  color: #eee;
  padding: 1em;
  font-size: 1.1em;
  line-height: 1.5em;
}

.tooltip-element.tooltip-theme-arrows .tooltip-content:before {
  content: "";
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  border-color: transparent;
  border-width: $tooltip_arrow_size;
  border-style: solid;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-bottom.tooltip-element-attached-center .tooltip-content {
  margin-bottom: $tooltip_arrow_size;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-bottom.tooltip-element-attached-center .tooltip-content:before {
  top: 100%;
  left: 50%;
  margin-left: -$tooltip_arrow_size;
  border-top-color: $tooltip_color;
}

/*
.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-top.tooltip-element-attached-center .tooltip-content {
  margin-top: $tooltip_arrow_size;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-top.tooltip-element-attached-center .tooltip-content:before {
  bottom: 100%;
  left: 50%;
  margin-left: -$tooltip_arrow_size;
  border-bottom-color: $tooltip_color;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-right.tooltip-element-attached-middle .tooltip-content {
  margin-right: $tooltip_arrow_size;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-right.tooltip-element-attached-middle .tooltip-content:before {
  left: 100%;
  top: 50%;
  margin-top: -$tooltip_arrow_size;
  border-left-color: $tooltip_color;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-left.tooltip-element-attached-middle .tooltip-content {
  margin-left: $tooltip_arrow_size;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-left.tooltip-element-attached-middle .tooltip-content:before {
  right: 100%;
  top: 50%;
  margin-top: -$tooltip_arrow_size;
  border-right-color: $tooltip_color;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-top.tooltip-element-attached-left.tooltip-target-attached-bottom .tooltip-content {
  margin-top: $tooltip_arrow_size;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-top.tooltip-element-attached-left.tooltip-target-attached-bottom .tooltip-content:before {
  bottom: 100%;
  left: $tooltip_arrow_size;
  border-bottom-color: $tooltip_color;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-top.tooltip-element-attached-right.tooltip-target-attached-bottom .tooltip-content {
  margin-top: $tooltip_arrow_size;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-bottom.tooltip-element-attached-left.tooltip-target-attached-top .tooltip-content {
  margin-bottom: $tooltip_arrow_size;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-bottom.tooltip-element-attached-left.tooltip-target-attached-top .tooltip-content:before {
  top: 100%;
  left: $tooltip_arrow_size;
  border-top-color: $tooltip_color;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-bottom.tooltip-element-attached-right.tooltip-target-attached-top .tooltip-content {
  margin-bottom: $tooltip_arrow_size;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-bottom.tooltip-element-attached-right.tooltip-target-attached-top .tooltip-content:before {
  top: 100%;
  right: $tooltip_arrow_size;
  border-top-color: $tooltip_color;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-top.tooltip-element-attached-right.tooltip-target-attached-left .tooltip-content {
  margin-right: $tooltip_arrow_size;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-top.tooltip-element-attached-right.tooltip-target-attached-left .tooltip-content:before {
  top: $tooltip_arrow_size;
  left: 100%;
  border-left-color: $tooltip_color;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-top.tooltip-element-attached-left.tooltip-target-attached-right .tooltip-content {
  margin-left: $tooltip_arrow_size;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-top.tooltip-element-attached-left.tooltip-target-attached-right .tooltip-content:before {
  top: $tooltip_arrow_size;
  right: 100%;
  border-right-color: $tooltip_color;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-bottom.tooltip-element-attached-right.tooltip-target-attached-left .tooltip-content {
  margin-right: $tooltip_arrow_size;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-bottom.tooltip-element-attached-right.tooltip-target-attached-left .tooltip-content:before {
  bottom: $tooltip_arrow_size;
  left: 100%;
  border-left-color: $tooltip_color;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-bottom.tooltip-element-attached-left.tooltip-target-attached-right .tooltip-content {
  margin-left: $tooltip_arrow_size;
}

.tooltip-element.tooltip-theme-arrows.tooltip-element-attached-bottom.tooltip-element-attached-left.tooltip-target-attached-right .tooltip-content:before {
  bottom: $tooltip_arrow_size;
  right: 100%;
  border-right-color: $tooltip_color;
} */

/* .tooltip-element.tooltip-theme-arrows {
  pointer-events: none;
}
 */
.tooltip-element.tooltip-theme-arrows .tooltip-content {
  padding: 0.5em 1em;
}

</style>
