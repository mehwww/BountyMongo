bountyMongo.directive('sidebarDatabase', [
  'database',
  'collection',
  'records',
  function (database, collection, records) {
    return {
      restrict: 'A',
      templateUrl: './partials/sidebarDatabase.html',
      link: function (scope, element, attrs) {
        scope.toggleDatabase = function () {
          scope.isOpen = !scope.isOpen;
          if (scope.isOpen) {
            records.server(scope.server);
            records.database(scope.database);
            records.collection('');
//            bucket.queryOptions('server', scope.server);
//            bucket.queryOptions('database', scope.database);
//            bucket.queryOptions('collection', '');
          }
          //scope.server is prototypically inheritance from parent
          database(scope.server, scope.database).query().then(function (response) {
            scope.collectionList = response.collectionNames;
          })
        }
        scope.selectCollection = function (coll) {
//          bucket.queryOptions('server', scope.server);
//          bucket.queryOptions('database', scope.database);
//          bucket.queryOptions('collection', coll);
          records.server(scope.server);
          records.database(scope.database);
          records.collection(coll);
          records.queryOptions('p',1);
//          records.initQueryOptions();
//          collection(scope.server, scope.database, coll, bucket.queryOptions()).query().then(function (response) {
//            bucket.records = response;
//          })
          records.recordsRefresh();
        }
      }
    }

  }])