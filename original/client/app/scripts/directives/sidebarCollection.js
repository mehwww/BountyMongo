bountyMongo.directive('sidebarCollection', ['collection', 'bucket', function (collection, bucket) {
  return {
    restrict: 'A',
    require:'^ngModel',
    templateUrl: './partials/sidebarCollection.html',
    link: function (scope, element, attrs,ctrl) {
      scope.selectCollection = function () {

        console.log(ctrl.$viewValue)

        bucket.queryOptions('server',scope.server);
        bucket.queryOptions('database',scope.database);
        bucket.queryOptions('collection',scope.collection);
        //scope.server and scope.database are prototypically inheritance from parent
        collection(scope.server, scope.database, scope.collection).query().then(function (response) {
          bucket.records = response;
        })
      }

    }
  }

}])