//"use strict"

var bountyMongo = angular.module('bountyMongo', []);

bountyMongo.value('DATABASE_NAME','localhost')


bountyMongo.controller('sidebar',['$scope','databasesResource',function($scope,databasesResource){
    databasesResource('localhost').query().then(function(res){
        $scope.test = res;
    })


//    databasesResource();
}])
bountyMongo.factory('databasesResource', [ '$http', function ($http) {
    return function (databaseName) {
        var databasesUrl = 'http://localhost:3000/servers/' + databaseName;
        var Resource = function (data) {
            angular.extend(this, data);
        };
        Resource.query = function () {
            return $http.get(databasesUrl).then(function (response) {
                var result = [];
                angular.forEach(response.data, function (value, key) {
                    result[key] = new Resource(value);
                });
                return result;
            });
        }
        return Resource;
    }
}])
