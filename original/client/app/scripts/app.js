//"use strict"

var bountyMongo = angular.module('bountyMongo', ['ui.bootstrap']);

//bountyMongo.config( function ($locationProvider) {
//  $locationProvider.html5Mode(true);
//})

bountyMongo.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode(true);
}])
