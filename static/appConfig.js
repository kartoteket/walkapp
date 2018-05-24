
(function (window) {
  const hostname = window.location.hostname
  let serverEnv = 'prod'
  if (hostname.indexOf('.dev') >= 0 || hostname.indexOf('localhost') >= 0) { // process.env.NODE_ENV === 'development' tests dev vs build in npm
    serverEnv = 'dev'
  } else if (hostname.indexOf('dev.') >= 0) {
    serverEnv = 'staging'
  }
  const isProduction = serverEnv === 'prod'

  const config = {
    env: serverEnv,
    debug: false,
    apiUrl: '/api',
    rootUrl: serverEnv === 'dev' ? 'https://risiko.dev' : 'https://' + hostname,
    itemsSectionId: isProduction ? 7 : 7, // currently in sync, but that may change
    highlightfirst: false,
    enableTags: false,
    geoConfig: {
      enabled: false,
      maximumAge: 5 * 60 * 1000,
      timeout: 10 * 1000,
      enableHighAccuracy: true
    },
    mapConfig: {
      zoomBase: 18,
      zoomLow: 5,
      zoomHigh: 20,
      gesture: 'greedy'
    },
    imgConfig: {
      debug: 1,
      maxWidth: 512,
      quality: 0.7,
      autoRotate: true,
      outputFormat: 'verbose'
    },
    sentry: {
      capture: isProduction,
      logUser: isProduction,
      userFeedback: isProduction
    }
  }

  window.appConfig = config
})(window)
