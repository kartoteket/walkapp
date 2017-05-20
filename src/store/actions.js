import api from '../utils/api.js'
import form from '../utils/form.js'
import errors from '../utils/errors.js'
import Raven from 'raven-js'

// NB, maybe better to pass in the url when we map the Action to my component, so we can handle any dynamic urls.
export default {

  initApp: (context) => {
    context.dispatch('getUser')
    if (!context.state.walk) {
      context.dispatch('getWalk')
    }
    context.dispatch('getItems')
    context.dispatch('getTags')
    context.dispatch('getLocation')
  },

  getWalk: (context, id) => {
    return new Promise((resolve, reject) => {
      api.get(context.state.config.apiUrl + '/walks/' + (id || context.getters.walkId) + '.json')
        .then((response) => {
          context.commit('SET_WALK', response)
          resolve()
        })
        .catch((error) => {
          errors.handler(context, error)
          reject()
        })
    })
  },

  getUser: (context) => {
    return api.get(context.state.config.apiUrl + '/user/me.json')
      .catch((error) => console.log(error))
      .then((response) => {
        if (context.state.config.sentry.logUser) {
          Raven.setUserContext({
            email: response.email,
            id: response.id,
            name: response.name
          })
        }
        context.commit('SET_USER', response)
  },

  getItem: (context, id) => {
    return api.get(context.state.config.apiUrl + '/walks/items/' + id + '.json')
      .then((response) => context.commit('APPEND_ITEMS', response))
      .catch((error) => console.log(error))
  },

  getItems: (context) => {
    return api.get(context.state.config.apiUrl + '/walks/' + context.getters.walkId + '/items.json')
      .then((response) => context.commit('SET_ITEMS', response.data))
      .catch((error) => console.log(error))
  },

  getTags: (context) => {
    return api.get(context.state.config.apiUrl + '/tags.json')
      .then((response) => context.commit('SET_TAGS', response.data))
      .catch((error) => console.log(error))
  },

  getLocation: (context) => {
    var geoOptions = context.state.config.geoConfig

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
    const conf = {
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    }

    // debug ->
    // let formdata = {}
    // for (var pair of request.entries()) {
    //   formdata[pair[0]] = pair[1]
    // }
    // console.log(formdata)
    // <- end debug

    return new Promise((resolve, reject) => {
      context.commit('RESET_NEW_ITEM')
      api.post(context.state.config.apiUrl, request, conf)
        .then((response) => {
          context.dispatch('getItem', response.data.id)
          context.commit('TOGGLE_HIGHLIGHT_FIRST', true)
          resolve()
        })
        .catch((error) => {
          errors.handler(context, error)
          // console.log(error.response)
          // context.commit('APP_MESSAGE', {type: 'error', body: error.response.statusText, title: 'Feil!', code: error.response.status})
          reject()
        })
    })
  }

}
