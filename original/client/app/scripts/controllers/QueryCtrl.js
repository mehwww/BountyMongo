bountyMongo.controller('QueryCtrl',['$scope','bucket','collection',function($scope,bucket,collection){
  $scope.pageSizeOptions = [5,10,20,50,100,200];
  $scope.pageSize = $scope.pageSizeOptions[0];

  $scope.$watch('pageSize',function(newVal){
    bucket.queryOptions('l',newVal);
    var server = bucket.queryOptions('server');
    var database = bucket.queryOptions('database');
    var coll = bucket.queryOptions('collection');
    if(!coll)return;
    collection(server,database,coll,bucket.queryOptions()).query().then(function (response) {
      bucket.records = response;
    })
  })

}])