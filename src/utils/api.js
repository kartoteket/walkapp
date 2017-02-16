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
  }
}
