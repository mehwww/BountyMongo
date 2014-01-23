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
          }
          //scope.server is prototypically inheritance from parent
          database(scope.server, scope.database).query().then(function (response) {
            scope.collectionList = response.collectionNames;
          })
        }
        scope.selectCollection = function (coll) {
          records.server(scope.server);
          records.database(scope.database);
          records.collection(coll);
          records.queryOptions('p',1);
          records.recordsRefresh();
        }
      }
    }

  }])