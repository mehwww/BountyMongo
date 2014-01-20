bountyMongo.directive('sidebarCollection', ['collection', 'bucket', function (collection, bucket) {
  return {
    restrict: 'A',
    templateUrl: './partials/sidebarCollection.html',
    link: function (scope, element, attrs) {
      scope.selectCollection = function () {
        //scope.server and scope.database are prototypically inheritance from parent
        collection(scope.server, scope.database, scope.collection).query().then(function (response) {
          bucket.records = response;
        })
      }

    }
  }

}])