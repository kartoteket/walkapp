import Raven from 'raven-js'
export default {

  handler (context, error) {
    // 401, Special case: let user log in
    if (error.response && error.response.status === 401) {
      // login message
      context.commit('APP_MESSAGE', {type: 'warning', body: 'Logg inn!', title: 'Ikke innlogget', code: error.response.status})

    // 666, Special case: User has blocked geo location
    } else if (error.response && error.response.status === 666) {
      context.commit('APP_MESSAGE', {
        type: 'warning',
        code: error.response.status,
        title: error.response.statusText,
        body: 'Dette verktøyet trenger din tillatelse til å bruke telefonens posisjon for å optimal bruk. Vennligst gå til innstillinger og skru på posisjonslokalisering for nettleseren'
      })
    } else {
      // store error message
      if (error.response) {
        context.commit('APP_MESSAGE', {type: 'error', body: error.response.statusText, title: 'Feil!', code: error.response.status})
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

    // write to console
    if (context.state.config.debug) {
      console.table(error)
    }
  }
}
