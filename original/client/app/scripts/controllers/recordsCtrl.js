bountyMongo.controller('recordsCtrl', [

  '$scope',
  'bucket',

  function ($scope, bucket) {
    $scope.bucket = bucket;
    $scope.records = bucket.records;
    $scope.$watch('bucket.records',function(newVal,oldVal,scope){
      if(newVal){
        scope.records = newVal;
      }
    })
  }])