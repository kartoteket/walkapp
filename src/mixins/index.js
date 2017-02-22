// import axios from 'axios'
// import moment from 'moment'
// import _ from 'lodash'

export default {

  // data: function () {
  //   return {
  //     scope: null,
  //     apiUrl: 'https://risiko.dev/api'
  //   }
  // },
//
  methods: {

    // getItems: function (refresh) {
    //   return (!refresh && this.items && this.items.length) ? this.items : this.getData('items')
    // },

    // getWalk: function (refresh) {
    //   return (!refresh && this.vandring.id === this.walkId) ? this.vandring : this.getData('walk')
    // },

    /**
     * [getData description]
     * @param  {[type]} scope [description]
     * @return {[type]}       [description]
     */
    // getData: function (scope) {
    //   var that = this
    //   this.scope = scope
    //   scope = scope === 'walk' ? null : scope  // walk is default

    //   var dataSuccess = function (response) {
    //     var _items = []
    //     var _walk

    //     if (response.data) {
    //       if (that.scope === 'items') {
    //         _.each(response.data.data, function (item, i) {
    //           item.position = {
    //             'lat': +item.position[0],
    //             'lng': +item.position[1]
    //           }
    //           _items.push(item)
    //         })
    //         console.log('Api call returns ' + _items.length + 'items')
    //         that.$emit('setItems', _items)
    //         return _items
    //         // that.$router.app.$emit('setItems', _items)
    //         // that.$router.app.$emit('newEvent', ['Set items in mixin'])
    //       } else {
    //         _walk = response.data
    //         _walk.id = +response.data.id
    //         _walk.date = moment(String(response.data.date.date)).format('DD.MM.YYYY hh:mm')
    //         that.$emit('setWalk', _walk)
    //       }
    //     }
    //   }

    //   var dataError = function (error) {
    //     if (error.response) {
    //       // The request was made, but the server responded with a status code that falls out of the range of 2xx
    //       console.log(error.response.data)
    //       console.log(error.response.status)
    //       console.log(error.response.headers)
    //     } else {
    //       // Something happened in setting up the request that triggered an Error
    //       console.log('Error', error.message)
    //     }
    //     console.log(error.config)
    //   }

    //   axios.get(this.apiUrl + '/walks/' + this.walkId + (scope ? '/' + scope : '') + '.json').then(dataSuccess).catch(dataError)
    // },

    // getUser: function () {
    //   var that = this

    //   // console.log('call /api/user/me.json')
    //   var dataSuccess = function (response) {
    //     if (response.data) {
    //       that.$emit('setUser', response.data)
    //     }
    //   }

    //   var dataError = function (error) {
    //     if (error.response) {
    //       // The request was made, but the server responded with a status code that falls out of the range of 2xx
    //       console.log(error.response.data)
    //       console.log(error.response.status)
    //       console.log(error.response.headers)
    //     } else {
    //       // Something happened in setting up the request that triggered an Error
    //       console.log('Error', error.message)
    //     }
    //     console.log(error.config)
    //   }

    //   axios.get(this.apiUrl + '/user/me.json').then(dataSuccess).catch(dataError)
    // },

    // /**
    //  * [getLocation description]
    //  * @return {[type]} [description]
    //  * Ref: https://developers.google.com/web/fundamentals/native-hardware/user-location/
    //  */
    // getLocation: function (callback) {
    //   var that = this
    //   var geoOptions = this.config.geoConfig

    //   var geoError = function (error) {
    //     console.log('Error occurred. Error code: ' + error.code)
    //     // error.code can be:
    //     //   0: unknown error
    //     //   1: permission denied
    //     //   2: position unavailable (error response from location provider)
    //     //   3: timed out
    //   }

    //   var geoSuccess = function (position) {
    //     // console.log(position, (that.currentPosition.timestamp === position.timestamp ? 'cached' : 'new'))
    //     that.$emit('setCurrentPosition', position)
    //   }

    //   navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions)
    // },

    // /**
    //  * [initMap description]
    //  * @param  {[type]}   mapOptions [description]
    //  * @param  {Function} callback   [description]
    //  * @return {[type]}              [description]
    //  */
    // initMap: function (mapOptions, callback) {
    //   var mapDefaults = {
    //     center: {lat: 64.467506, lng: 11.495773},
    //     zoom: this.config.mapConfig.zoomLow
    //   }
    //   var mapElm = document.getElementById('funnmap')

    //   mapOptions = _.extend(mapDefaults, mapOptions)

    //   return new google.maps.Map(mapElm, mapOptions)
    // },

    /**
     * [zoomAndCenter description]
     * @param  {[type]} pos  [description]
     * @param  {[type]} zoom [description]
     * @return {[type]}      [description]
     */
    // zoomAndCenter: function (pos, zoom) {
    //   zoom = zoom || 10
    //   pos = pos.latitude ? {lat: pos.latitude, lng: pos.longitude} : pos
    //   this.map.setZoom(zoom)
    //   this.map.setCenter(pos)
    // },

    // panTo: function (pos) {
    //   pos = pos.latitude ? {lat: pos.latitude, lng: pos.longitude} : pos
    //   this.map.panTo(pos)
    // }
  }
}
