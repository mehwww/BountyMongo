bountyMongo.directive('sidebarDatabase', ['database', 'collection','bucket', function (database, collection,bucket) {
  return {
    restrict: 'A',
    templateUrl: './partials/sidebarDatabase.html',
    link: function (scope, element, attrs) {
      scope.toggleDatabase = function () {
        scope.isOpen = !scope.isOpen;
        if (scope.isOpen) {
          bucket.queryOptions('server', scope.server);
          bucket.queryOptions('database', scope.database);
          bucket.queryOptions('collection','');
        }
        //scope.server is prototypically inheritance from parent
        database(scope.server, scope.database).query().then(function (response) {
          scope.collectionList = response;
        })
      }
      scope.selectCollection = function (coll) {
        bucket.queryOptions('server',scope.server);
        bucket.queryOptions('database', scope.database);
        bucket.queryOptions('collection', coll);
        collection(scope.server, scope.database, coll,bucket.queryOptions()).query().then(function (response) {
          bucket.records = response;
        })
      }
    }
  }

}])