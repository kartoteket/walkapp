
(function(window, undefined) {

    var config = {
      serverUrl: 'https://myserver.com',
      foo: 'abc',
      geoConfig: {
        enabled: false,  // Todo: Probably best to move this pout of config
        maximumAge: 5 * 60 * 1000,
        timeout: 10 * 1000,
        enableHighAccuracy: true
      },
      mapConfig: {
        zoomBase: 18,
        zoomLow: 5,
        zoomHigh: 20
      },
      imageUploader: {
        debug: 1,
        maxWidth: 512,
        quality: 0.7,
        autoRotate: true,
        outputFormat: 'verbose'
      }
    }
    window.appConfig = config

})(window);
