import api from '../utils/api.js'
import form from '../utils/form.js'

// NB, maybe better to pass in the url when we map the Action to my component, so we can handle any dynamic urls.
export default {
  initApp: (context) => {
    context.dispatch('getItems')
    context.dispatch('getWalk')
    context.dispatch('getUser')
    context.dispatch('getTags')
    context.dispatch('getLocation')
  },

  getWalk: (context) => {
    return api.get(context.state.Xconfig.apiUrl + '/walks/' + context.getters.walkId + '.json')
      .then((response) => context.commit('SET_WALK', response))
      .catch((error) => console.log(error))
  },

  getUser: (context) => {
    return api.get(context.state.Xconfig.apiUrl + '/user/me.json')
      .then((response) => context.commit('SET_USER', response))
      .catch((error) => console.log(error))
  },

  getItem: (context, id) => {
    return api.get(context.state.Xconfig.apiUrl + '/walks/items/' + id + '.json')
      .then((response) => context.commit('APPEND_ITEMS', response))
      .catch((error) => console.log(error))
  },

  getItems: (context) => {
    return api.get(context.state.Xconfig.apiUrl + '/walks/' + context.getters.walkId + '/items.json')
      .then((response) => context.commit('SET_ITEMS', response.data))
      .catch((error) => console.log(error))
  },

  getTags: (context) => {
    return api.get(context.state.Xconfig.apiUrl + '/tags.json')
      .then((response) => context.commit('SET_TAGS', response.data))
      .catch((error) => console.log(error))
  },

  getLocation: (context) => {
    var geoOptions = context.state.Xconfig.geoConfig

    var geoError = function (error) {
      // error.code can be: 0: unknown error, 1: permission denied, 2: position unavailable (error response from location provider), 3: timed out
      console.log('Error occurred. Error code: ' + error.code)
    }

    var geoSuccess = function (position) {
      // console.log(position, (that.currentPosition.timestamp === position.timestamp ? 'cached' : 'new'))
      context.commit('SET_CURRENT_POSITION', position)
    }

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions)
  },

  saveItem: (context) => {
    const request = form.create(context)
    const config = {
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    }

    // debug ->
    // let formdata = {}
    // for (var pair of request.entries()) {
    //   formdata[pair[0]] = pair[1]
    // }
    // console.log(formdata)
    // <- end debug

    return api.post(context.state.Xconfig.apiUrl, request, config)
      .then((response) => {
        context.dispatch('getItem', response.data.id)
        context.commit('TOGGLE_HIGHLIGHT_FIRST', true)
        context.commit('RESET_NEW_ITEM')
        context.commit('TOGGLE_LOADING')
      })
      .catch((error) => console.log(error))
  }
}
