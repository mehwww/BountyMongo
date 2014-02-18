bountyMongo.directive('bmSidebar', [
  'database',
  'collection',
  'records',
  function (database, collection, records) {
    return {
      restrict: 'A',
      templateUrl: '/partials/bmSidebar.html',
      link: function (scope, element, attrs) {
        scope.toggleDatabase = function () {
          scope.isOpen = !scope.isOpen;
          if (scope.isOpen) {
            records.server(scope.server);
            records.database(scope.database);
            records.collection('');
          }
          console.log('scope.server',scope.server)
          console.log('scope.database',scope.database)
          //scope.server is prototypically inheritance from parent
          collection(scope.server, scope.database.name).list().then(function (response) {
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