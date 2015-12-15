'use strict';

/**
 * @ngdoc overview
 * @name sudokuApp
 * @description
 * # sudokuApp
 *
 * Main module of the application.
 */
angular
  .module('sudokuApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

  angular.module('sudokuApp').factory('_', ['$window',
      function($window) {
        // place lodash include before angular
        return $window._;
      }
    ]);


