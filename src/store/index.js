import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import actions from './actions.js'
import config from 'appConfig'

Vue.use(Vuex)

const defaultItem = {
  message: '',
  image: null,
  tags: [],
  priority: 2,
  position: {
    address: '',
    lat: null,
    lng: null
  }
}

const hostname = window.location.hostname
let serverEnv = 'prod'
if (hostname.indexOf('.dev') >= 0 || hostname.indexOf('localhost') >= 0) { // process.env.NODE_ENV === 'development' tests dev vs build in npm
  serverEnv = 'dev'
} else if (hostname.indexOf('dev.') >= 0) {
  serverEnv = 'staging'
}
const isProduction = serverEnv === 'prod'

console.log('Environment: ' + serverEnv)
// console.log(config)

export default new Vuex.Store({
  state: {
    user: {},
    walk: null,
    items: [],
    tags: [],
    newItem: Object.assign({}, defaultItem),
    currentPosition: {},
    loading: false,
    appMessage: {},
    config: {
      env: serverEnv,
      debug: true,
      sentry: {
        capture: isProduction,
        logUser: isProduction,
        userFeedback: isProduction
      },
      apiUrl: '/api',
      rootUrl: serverEnv === 'dev' ? 'https://risiko.dev' : 'https://' + window.location.hostname,
      itemsSectionId: isProduction ? 7 : 7, // currently in sync, but that may change
      highlightfirst: false,
      geoConfig: config.geoConfig,
      mapConfig: config.mapConfig,
      imgConfig: config.imageUploader
    }
  },

  getters: {
    walkId: state => {
      return state.route.params.walk_id
    },

    userId: state => {
      return state.user.id
    },

    itemsCount: state => {
      return state.items.length
    },

    prettyDate: state => {
      if (state.walk && state.walk.date) {
        return moment(state.walk.date.date).format('DD.MM.YYYY hh:mm')
      }
      return ''
    },

    // LatLngLiteral - https://developers.google.com/maps/documentation/javascript/reference#LatLngLiteral
    currentCoords: state => {
      if (state.currentPosition.coords) {
        return {lat: state.currentPosition.coords.latitude, lng: state.currentPosition.coords.longitude}
      }
      return false
    },

    mapConfig: state => {
      return state.config.mapConfig
    },

    geoConfig: state => {
      return state.config.geoConfig
    },

    imgConfig: state => {
      return state.config.imgConfig
    }
  },

  mutations: {

    // Data loaded from API
    SET_USER: (state, data) => {
      state.user = data
    },
    SET_WALK: (state, data) => {
      state.walk = data
    },
    SET_ITEMS: (state, data) => {
      state.items = data
    },
    SET_TAGS: (state, data) => {
      state.tags = data
    },

    // mutate on save
    APPEND_ITEMS: (state, data) => {
      state.items.unshift(data) // new on top, so unshift insted of push
    },
    RESET_NEW_ITEM: (state) => {
      state.newItem = Object.assign({}, defaultItem)
    },

    // Set properties on item
    SET_ITEM_TAGS: (state, data) => {
      state.newItem.tags = data
    },
    SET_POSITION: (state, data) => {
      state.newItem.position = data
    },
    SET_IMAGE: (state, data) => {
      state.newItem.image = data
    },
    SET_MESSAGE: (state, data) => {
      state.newItem.message = data
    },
    SET_PRIORITY: (state, data) => {
      state.newItem.priority = data
    },

    // other states
    SET_CURRENT_POSITION: (state, data) => {
      state.config.geoConfig.enabled = !!data.timestamp // if position is from sensors or static
      state.currentPosition = data
    },
    TOGGLE_HIGHLIGHT_FIRST: (state, force) => {
      state.config.highlightfirst = (force === false || force === true) ? !!force : !state.config.highlightfirst
    },
    TOGGLE_LOADING: (state, force) => {
      state.loading = (force === false || force === true) ? !!force : !state.loading
    },
    APP_MESSAGE: (state, msg) => {
      state.appMessage = msg
    }

  },

  actions: actions
})
