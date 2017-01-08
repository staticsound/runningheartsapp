var APP_NAME = 'runningHeartsApp'; {
  /* global angular */
  'use strict';

  var APP_DEPENDENCIES = ['ui.router', 'ngMaterial', 'ngAnimate', 'ngAria', 'ngMessages', 'ngResource'];
  angular
    .module(APP_NAME, APP_DEPENDENCIES)
    .config(function($mdThemingProvider) {
      var whiteMap = $mdThemingProvider.extendPalette('red', {
        '500': '#ffffff'
      })
      $mdThemingProvider.definePalette('white', whiteMap);

      $mdThemingProvider.theme('default')
        .primaryPalette('deep-orange')
        .accentPalette('deep-orange', {
          'default': '900'
        })
        .backgroundPalette('grey', {
          'hue-1': '400'
        });
    })
    .config(function($locationProvider) {

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
      });

    })
}
