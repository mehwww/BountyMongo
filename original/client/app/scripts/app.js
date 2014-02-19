//"use strict"

var bountyMongo = angular.module('bountyMongo', ['ui.bootstrap', 'ngRoute']);

bountyMongo.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
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
      templateUrl: '/partials/bmRecords.html',
      controller: 'MainCtrl'
    })
    .otherwise({redirectTo: '/'})
  $locationProvider.html5Mode(true);
}])

//bountyMongo.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
//  $routeProvider.when('databases/:databaseName',{
//    template: '<div></div>',
//    controller: 'MainCtrl'
//  })
//  $locationProvider.html5Mode(true);
//}])
