bountyMongo.controller('RecordsCtrl', [

  '$scope',
  'bucket',
  'collection',

  function ($scope, bucket,collection) {
    $scope.records = bucket.records;

    $scope.$watch('page', function (newValue, oldValue) {
      bucket.queryOptions('p',$scope.page);
      var server = bucket.queryOptions('server');
      var database = bucket.queryOptions('database');
      var coll = bucket.queryOptions('collection');
      if(!coll)return;
      collection(server,database,coll,bucket.queryOptions()).query().then(function (response) {
        bucket.records = response;
      })
      console.log(newValue)
    });

    $scope.$watch(
      function () {
        return bucket.records
      },
      function (newVal) {
          $scope.records = newVal;
      })
  }])