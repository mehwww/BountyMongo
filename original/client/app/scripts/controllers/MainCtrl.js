bountyMongo.controller('MainCtrl', [

  '$scope',
  '$location',

  function ($scope, $location) {
    $scope.$on('recordsRefresh', function (event, response) {
//      $scope.records = $location.path();
//      $scope.records = response;
    })
    console.log('url',$location.url())
  }])