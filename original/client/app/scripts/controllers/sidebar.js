bountyMongo.controller('sidebar',['$scope','databasesResource',function($scope,databasesResource){
    databasesResource('localhost').query().then(function(res){
        $scope.test = res;
    })


//    databasesResource();
}])