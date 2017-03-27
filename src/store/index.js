import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import actions from './actions.js'

Vue.use(Vuex)

const defaultItem = {
  message: '',
  image: null,
  tags: [],
  position: {
    address: '',
    lat: null,
    lng: null
  }
}

export default new Vuex.Store({
  state: {
    user: {},
    walk: null,
    items: [],
    tags: [],
    newItem: Object.assign({}, defaultItem),
    currentPosition: {},
    config: {
      apiUrl: '/api',
      rootUrl: process.env.NODE_ENV === 'development' ? 'https://risiko.dev' : 'https://dev.risikorydding.no',
      itemsSectionId: 8,
      highlightfirst: false,
      geoConfig: {
        maximumAge: 5 * 60 * 1000,
        timeout: 10 * 1000,
        enableHighAccuracy: true
      },
      mapConfig: {
        zoomBase: 10,
        zoomLow: 5,
        zoomHigh: 20
      }
    },
    loading: false
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

    currentCoords: state => {
      return state.currentPosition.coords
    },

    mapConfig: state => {
      return state.config.mapConfig
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

    // other states
    SET_CURRENT_POSITION: (state, data) => {
      state.currentPosition = data
    },
    TOGGLE_HIGHLIGHT_FIRST: (state, force) => {
      state.config.highlightfirst = (force === false || force === true) ? !!force : !state.config.highlightfirst
    },
    TOGGLE_LOADING: (state, force) => {
      state.loading = (force === false || force === true) ? !!force : !state.loading
    }
  },

  actions: actions
})
