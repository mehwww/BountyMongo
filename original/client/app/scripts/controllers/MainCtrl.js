bountyMongo.controller('MainCtrl', [

  '$scope',
  'bucket',
  'collection',

  function ($scope, bucket,collection) {
    $scope.$on('recordsRefresh',function(event,response){
//      console.log(response)
      $scope.records = response;
    })
  }])