export default {

  handler (context, error) {
    // store error message
    context.commit('APP_MESSAGE', {type: 'error', body: error.response.statusText, title: 'Feil!', code: error.response.status})

    if (context.state.config.debug) {
      console.log(error)
    }
  }
}
