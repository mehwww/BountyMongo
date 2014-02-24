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

//    $httpProvider.defaults.withCredentials = true;
    }])

  .constant('API_URL','/api')

//bountyMongo.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
//  $routeProvider.when('databases/:databaseName',{
//    template: '<div></div>',
//    controller: 'MainCtrl'
//  })
//  $locationProvider.html5Mode(true);
//}])
