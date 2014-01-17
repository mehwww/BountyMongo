bountyMongo.controller('RecordsCtrl', [

  '$scope',
  'bucket',

  function ($scope, bucket) {
//    $scope.bucket = bucket;
    $scope.records = bucket.records;
    $scope.$watch(
      function () {
        return bucket.records
      },
      function (newVal) {
          $scope.records = newVal;
          $scope.currentPage = bucket.config.queryOptions.p;
          $scope.numPages = parseInt($scope.records.count/bucket.config.queryOptions.l,10)+1;
      })


  }])