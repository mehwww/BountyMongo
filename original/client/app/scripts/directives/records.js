bountyMongo.directive('records', ['bucket', 'collection', function (bucket, collection) {
  return{
    restrict: 'E',
    scope: {
      records: '='
    },
    templateUrl: './partials/records.html',
    link: function (scope, element, attrs) {
//      scope.$watch(
//        function () {
//          return bucket.records
//        },
//        function (newVal) {
//          console.log('records watcher')
//          scope.records = newVal;
//        });

//      scope.$watch('page', function (newValue, oldValue) {
//        bucket.queryOptions('p',scope.page);
//        var server = bucket.queryOptions('server');
//        var database = bucket.queryOptions('database');
//        var coll = bucket.queryOptions('collection');
//        if(!coll)return;
//        collection(server,database,coll,bucket.queryOptions()).query().then(function (response) {
//          bucket.records = response;
//        })
//      });
    }
  }
}]);