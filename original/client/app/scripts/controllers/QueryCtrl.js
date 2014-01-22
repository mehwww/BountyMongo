bountyMongo.controller('QueryCtrl',['$scope',function($scope){
  $scope.pageSizeOptions = [5,10,20,50,100,200];
  $scope.pageSize = $scope.pageSizeOptions[0];
}])