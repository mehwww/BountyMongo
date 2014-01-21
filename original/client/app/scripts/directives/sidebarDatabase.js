bountyMongo.directive('sidebarDatabase', ['database', 'bucket', function (database, bucket) {
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
    }
  }

}])