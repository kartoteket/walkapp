<template>
  <div class="mapItems">
    <header-component></header-component>

    <div role="main" class="webapp__content">
        <div id="funnmap" class="appmap appmap--short"></div>
    </div>

    <footer-component></footer-component>
  </div>
</template>

<script>
/* global google:true */
import {mapState, mapGetters} from 'vuex'
import mixins from '../mixins'

export default {
  name: 'MapItems',

  mixins: [mixins],

  data () {
    return {
      map: {}
    }
  },

  computed: {
    ...mapState([
      'items',
      'Xconfig'
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
      var mapOptions = {
        center: {lat: 64.467506, lng: 11.495773},
        zoom: this.Xconfig.mapConfig.zoomLow
      }
      var mapElm = document.getElementById('funnmap')
      this.map = new google.maps.Map(mapElm, mapOptions)

      if (Array.isArray(items) && items.length) {
        items.forEach((m, i) => {
          if (m.position.lat && m.position.lng) {
            bounds.extend(m.position)

            marker = new google.maps.Marker({
              position: m.position,
              map: that.map,
              title: String(m.title).substring(0, 100),
              label: (items.length - i).toString()
            })

            // last (items are looped in reversed order)
            if (that.Xconfig.highlightfirst && i === 0) {
              marker.setAnimation(google.maps.Animation.BOUNCE)
            }

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
              return function () {
                infoWindow.setContent(that.getInfoWindowContent(m))
                infoWindow.open(that.map, marker)
              }
            })(marker, i))
          }
        })

        // fit new bounds
        this.map.fitBounds(bounds)

      // zoom map to currentPosition if no markers
      } else {
        if (this.currentCoords) {
          this.zoomAndCenter(that.currentCoords)
        } else {
          this.$watch('currentCoords', that.zoomAndCenter)
        }
      }
    },

    // TODO: move generic version to mixin. reuse in setlocation.js
    getInfoWindowContent: function (data) {
      var img = null
      var header
      var footer

      if (data.image) {
        img = '<img class="infowindow__img" src="' + data.image + '">'
      }
      header = '<div class="infowindow__header"><h1>' + data.title + '</h1></div>'
      footer = '<div class="infowindow__footer">' + data.address + '</div>'
      return '<div class="infowindow">' + header + (img || '') + footer + '</div>'
    }
  },

  // created: function () {
  // },

  // updated: function () {
  //   console.log('UPDATED')
  // },

  mounted: function () {
    if (this.items.length) {
      this.createMapMarkers()
    }
  }
}
</script>
