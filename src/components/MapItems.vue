<template>
  <div class="mapItems">
    <header-component></header-component>

    <div role="main" class="webapp__content">
        <div id="funnmap" class="appmap appmap--short"></div>

        <div  v-if="isLoading" class="is-loading">
          <clip-loader :loading="isLoading" :size="spinnerSize"></clip-loader>
        </div>

    </div>

    <footer-component></footer-component>
  </div>
</template>

<script>
/* global google:true */
import {mapState, mapGetters} from 'vuex'
import MarkerClusterer from 'node-js-marker-clusterer'
// import mapStyle from '../assets/json/silver.json'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

export default {
  name: 'MapItems',

  components: {
    ClipLoader
  },

  data () {
    return {
      map: {},
      isLoading: false, // tmp fix - finished loading not triggering consitently
      spinnerSize: '100px'
    }
  },

  computed: {
    ...mapState([
      'items',
      'config'
    ]),
    ...mapGetters([
      'currentCoords'
    ])
  },

  watch: {
    items: function (val, oldVal) {
      if (val.length) {
        this.createMapMarkers()
      }
    }
  },

  methods: {

    // setItems: function (items) {
    //   this.items = items
    //   this.createMapMarkers()
    // },

    createMapMarkers: function () {
      var that = this
      var marker
      var items = this.items
      var bounds = new google.maps.LatLngBounds()
      var infoWindow = new google.maps.InfoWindow()

      var icon = {
        // circle
        // path: 'M-20, 0a20, 20 0 1, 0 40, 0a20, 20 0 1, 0 -40, 0',
        // pin
        // path: 'M18.973 17.802l-7.794-4.5c-0.956-0.553-2.18-0.225-2.732 0.731-0.552 0.957-0.224 2.18 0.732 2.732l7.793 4.5c0.957 0.553 2.18 0.225 2.732-0.732 0.554-0.956 0.226-2.179-0.731-2.731zM12.545 12.936l6.062 3.5 2.062-5.738-4.186-2.416-3.938 4.654zM8.076 27.676l5.799-7.044-2.598-1.5-3.201 8.544zM23.174 7.525l-5.195-3c-0.718-0.414-1.635-0.169-2.049 0.549-0.415 0.718-0.168 1.635 0.549 2.049l5.196 3c0.718 0.414 1.635 0.169 2.049-0.549s0.168-1.635-0.55-2.049z',
        path: 'M20.5 15h-9c-1.104 0-2 0.896-2 2s0.896 2 2 2h9c1.104 0 2-0.896 2-2s-0.896-2-2-2zM13.583 8l-1.083 6h7l-1.084-6h-4.833zM16 29l1.5-9h-3l1.5 9zM13 7h6c0.828 0 1.5-0.672 1.5-1.5s-0.672-1.5-1.5-1.5h-6c-0.829 0-1.5 0.672-1.5 1.5s0.671 1.5 1.5 1.5z',
        fillColor: '#2ca286',
        fillOpacity: 1, // factor of priority ?
        anchor: new google.maps.Point(12, 32),
        strokeWeight: 0,
        scale: 1.25
      }

      var mapOptions = {
        center: {lat: 64.467506, lng: 11.495773},
        zoom: this.config.mapConfig.zoomLow,
        gestureHandling: this.config.mapConfig.gesture,
        streetViewControl: this.config.mapConfig.streetViewControl
        // styles: mapStyle
      }
      var mapElm = document.getElementById('funnmap')
      this.map = new google.maps.Map(mapElm, mapOptions)

      this.map.addListener('tilesloaded', function () {
        that.isLoading = false
      })

      if (Array.isArray(items) && items.length) {
        var markers = items.map(function (m, i) {
          if (m.position.lat && m.position.lng) {
            bounds.extend(m.position)

            marker = new google.maps.Marker({
              position: m.position,
              map: that.map,
              title: String(m.title).substring(0, 100),
              label: (items.length - i).toString(),
              icon: icon
            })

            // last (items are looped in reversed order)
            if (that.config.highlightfirst && i === 0) {
              marker.setAnimation(google.maps.Animation.BOUNCE)
            }

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
              return function () {
                infoWindow.setContent(that.getInfoWindowContent(m))
                infoWindow.open(that.map, marker)
              }
            })(marker, i))
          }
          return marker
        })

        /* eslint-disable no-new */
        /* var markerCluster = */new MarkerClusterer(that.map, markers,
          {
            imagePath: this.config.rootUrl + '/img/walks/m', // Go external because local path does not play well with webpack assets managment...
            maxZoom: 18
          }
        )

        // fit new bounds
        this.map.fitBounds(bounds)

      // zoom map to currentPosition if no markers
      } else {
        if (this.currentCoords) {
          this.centerMap()
        } else {
          this.$watch('currentCoords', that.centerMap)
        }
      }
    },

    centerMap: function () {
      if (this.currentCoords) {
        this.map.setCenter(this.currentCoords)
      }
    },

    // TODO: move generic version to mixin. reuse in setlocation.js
    getInfoWindowContent: function (data) {
      var img = null
      var header
      var footer
      var content
      var tags = ''
      var sep = ''

      if (data.tags.length) {
        tags = 'Emneord: '
        for (let tag of data.tags) {
          tags += sep + tag.name
          sep = ' | '
        }
      }

      if (data.image) {
        img = '<img class="infowindow__img" src="' + data.image + '">'
      }
      header = '<div class="infowindow__header"><h1>' + data.title + '</h1></div>'
      content = '<div class="infowindow__content">' + tags + '</div>'
      footer = '<div class="infowindow__footer">' + data.address + '</div>'
      return '<div class="infowindow">' + header + (img || '') + content + footer + '</div>'
    }
  },

  // created: function () {
  // },

  // updated: function () {
  //   console.log('UPDATED')
  // },

  mounted: function () {
    setTimeout(() => { this.createMapMarkers() }, 1000) // rotten way to wait for google maps to be loaded

    // if (this.items.length) {
      //   this.createMapMarkers()
    // }
  }
}
</script>

<style>
  .infowindow__img {
    width: 200px;
  }
</style>
