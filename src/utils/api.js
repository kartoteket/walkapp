import axios from 'axios'

export default {

  get: function (url, request) {
    return axios.get(url, request)
    .then((response) => Promise.resolve(response.data))
    .catch((error) => Promise.reject(error))
  },

  post: function (url, request) {
    return axios.post(url, request)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }
}
