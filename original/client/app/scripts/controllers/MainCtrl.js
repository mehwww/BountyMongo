bountyMongo.controller('MainCtrl', [

  '$scope',

  function ($scope) {
    $scope.$on('recordsRefresh',function(event,response){
      $scope.records = response;
    })
  }])