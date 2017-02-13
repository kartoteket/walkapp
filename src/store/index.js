import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import actions from './actions.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    walk: {},
    items: [],
    newItem: {
      message: '',
      image: null,
      position: {
        address: 'Trondheimsveien 4, 0561 Oslo, Norway',
        lat: 59.9189238,
        lng: 10.762951199999975
      }
    },
    currentPosition: {},
    Xconfig: {
      apiUrl: 'https://risiko.dev/api',
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
    }
  },

  getters: {
    walkId: state => {
      return state.route.params.walk_id
    },

    itemsCount: state => {
      return state.items.length
    },

    prettyDate: state => {
      if (state.walk.date) {
        return moment(state.walk.date.date).format('DD.MM.YYYY hh:mm')
      }
      return ''
    },

    currentCoords: state => {
      return state.currentPosition.coords
    },

    mapConfig: state => {
      return state.Xconfig.mapConfig
    }

  },

  mutations: {
    SET_USER: (state, data) => {
      state.user = data
    },
    SET_WALK: (state, data) => {
      state.walk = data
    },
    SET_ITEMS: (state, data) => {
      state.items = data
    },
    APPEND_ITEMS: (state, data) => {
      state.items.push(data)
    },
    RESET_ITEM: (state) => {
      state.newItem = {}
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

    SET_CURRENT_POSITION: (state, data) => {
      state.currentPosition = data
    },
    TOGGLE_HIGHLIGHT_FIRST: state => {
      state.Xconfig.highlightfirst = !state.Xconfig.highlightfirst
    }
  },

  actions: actions
})
