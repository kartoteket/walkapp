import Raven from 'raven-js'
export default {

  handler (context, error) {
    // store error message
    context.commit('APP_MESSAGE', {type: 'error', body: error.response.statusText, title: 'Feil!', code: error.response.status})

    // write to console
    if (context.state.config.debug) {
      console.log(error)
    }

    // capture to sentry
    if (context.state.config.sentry.capture) {
      Raven.captureException(error)
    }

    // Sentry User feeback
    if (context.state.config.sentry.userFeedback) {
      Raven.showReportDialog()
    }
  }
}
