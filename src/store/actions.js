import api from '../utils/api.js'
import form from '../utils/form.js'

// NB, maybe better to pass in the url when we map the Action to my component, so we can handle any dynamic urls.
export default {
  initApp: (store) => {
    store.dispatch('getItems')
    store.dispatch('getWalk')
    store.dispatch('getUser')
    store.dispatch('getLocation')
  },
  getItems: (store) => {
    return api.get(store.state.Xconfig.apiUrl + '/walks/' + store.getters.walkId + '/items.json')
      .then((response) => store.commit('SET_ITEMS', response.data))
      .catch((error) => console.log(error))
  },
  getWalk: (store) => {
    return api.get(store.state.Xconfig.apiUrl + '/walks/' + store.getters.walkId + '.json')
      .then((response) => store.commit('SET_WALK', response))
      .catch((error) => console.log(error))
  },
  getUser: (store) => {
    return api.get(store.state.Xconfig.apiUrl + '/user/me.json')
      .then((response) => store.commit('SET_USER', response))
      .catch((error) => console.log(error))
  },
  getLocation: (store) => {
    var geoOptions = store.state.Xconfig.geoConfig

    var geoError = function (error) {
      // error.code can be: 0: unknown error, 1: permission denied, 2: position unavailable (error response from location provider), 3: timed out
      console.log('Error occurred. Error code: ' + error.code)
    }

    var geoSuccess = function (position) {
      // console.log(position, (that.currentPosition.timestamp === position.timestamp ? 'cached' : 'new'))
      store.commit('SET_CURRENT_POSITION', position)
    }

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions)
  },

  saveItem: (store) => {
    const request = form.create(store)
    return api.post('http://risiko.dev/vandringer/funn/ny/', request)
      .then((response) => {
        store.commit('APPEND_ITEMS', response)
        store.commit('TOGGLE_HIGHLIGHT_FIRST')
        store.commit('RESET_NEW_ITEM')
      })
      .catch((error) => console.log(error))
  }
}
