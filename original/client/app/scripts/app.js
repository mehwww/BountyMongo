//"use strict"


var bountyMongo = angular.module('bountyMongo', ['ui.bootstrap', 'ngRoute', 'LocalStorageModule']);

bountyMongo
  .config([
    '$routeProvider',
    '$locationProvider',
    '$httpProvider',
    function ($routeProvider, $locationProvider, $httpProvider) {
      $routeProvider
        .when('/servers/:serverName', {
          templateUrl: '/partials/bmMain.html',
          controller: 'MainCtrl'
        })
        .when('/servers/:serverName/databases/:databaseName', {
          templateUrl: '/partials/bmMain.html',
          controller: 'MainCtrl'
        })
        .when('/servers/:serverName/databases/:databaseName/collections/:collectionName', {
          templateUrl: '/partials/bountyRecords.html',
          controller: 'MainCtrl'
        })
        .otherwise({redirectTo: '/'})

      $locationProvider.html5Mode(true);

    }])

  .constant('API_URL','/api')
