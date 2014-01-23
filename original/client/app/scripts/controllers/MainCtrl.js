bountyMongo.controller('MainCtrl', [

  '$scope',
  'bucket',
  'collection',

  function ($scope, bucket,collection) {
    $scope.totalItems = 64;
    $scope.currentPage = 4;

  }])