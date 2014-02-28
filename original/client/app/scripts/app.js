//"use strict"


var bountyMongo = angular.module('bountyMongo', ['ui.bootstrap', 'ngRoute', 'LocalStorageModule']);

bountyMongo
  .config([
    '$routeProvider',
    '$locationProvider',
    '$httpProvider',
    function ($routeProvider, $locationProvider, $httpProvider) {
      $routeProvider
        .when('/',{
          templateUrl:'blank.html'
        })
        .when('/servers/:serverName', {
          templateUrl: '/partials/bountyMain.html',
          controller: 'MainCtrl'
        })
        .when('/servers/:serverName/databases/:databaseName', {
          templateUrl: '/partials/bountyMain.html',
          controller: 'MainCtrl'
        })
        .when('/servers/:serverName/databases/:databaseName/collections/:collectionName', {
          templateUrl: '/partials/bountyRecords.html',
          controller: 'RecordsCtrl'
        })
        .otherwise({redirectTo: '/'})

      $locationProvider.html5Mode(true);

    }])

  .constant('API_URL','/api')
