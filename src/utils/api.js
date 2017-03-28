import axios from 'axios'

export default {

  get: function (url, request, config) {
    return axios.get(url, request, config)
    .then((response) => Promise.resolve(response.data))
    .catch((error) => Promise.reject(error))
  },

  post: function (url, request, config) {
    return axios.post(url, request, config)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  error: function (context, error) {
    if (error.response.status === 404) {
      console.log('Vi fant ikke walken')
    } else if (error.response.status === 500) {
      console.log('Au, faen vi fikk en 500')
    } else {
      console.log(error.response)
    }
    context.commit('TOGGLE_LOADING', false)
  }

}
