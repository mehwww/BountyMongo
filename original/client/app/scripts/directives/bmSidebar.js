bountyMongo.directive('bmSidebar', [
  '$location',
  'database',
  'collection',
  function ($location, database, collection) {
    return {
      restrict: 'A',
      templateUrl: '/partials/bmSidebar.html',
      link: function (scope, element, attrs) {
        scope.toggleDatabase = function () {
//          console.log('server', scope.server)
//          console.log('database', scope.database)
          scope.isOpen = !scope.isOpen;
          $location.path('/servers/' + encodeURIComponent(scope.server) + '/databases/' + encodeURIComponent(scope.database))

//          scope.redirectUrl = '/servers/' + encodeURIComponent(encodeURIComponent(scope.server))
//            + '/databases/' + encodeURIComponent(encodeURIComponent(scope.database))
          database(scope.server, scope.database).collections().then(function (response) {
            scope.collectionList = response
          })
        }

        scope.selectCollection = function (collection) {
          console.log(collection)
          $location.path('/servers/' + encodeURIComponent(scope.server)
            + '/databases/' + encodeURIComponent(scope.database)
            + '/collections/' + encodeURIComponent(collection))

        }
//        scope.toggleDatabase = function () {
//          scope.isOpen = !scope.isOpen;
//          if (scope.isOpen) {
//            records.server(scope.server);
//            records.database(scope.database);
//            records.collection('');
//          }
//          console.log('scope.server',scope.server)
//          console.log('scope.database',scope.database)
//          //scope.server is prototypically inheritance from parent
//          collection(scope.server, scope.database.name).list().then(function (response) {
//            scope.collectionList = response.collectionNames;
//          })
//        }
//        scope.selectCollection = function (coll) {
//          records.server(scope.server);
//          records.database(scope.database);
//          records.collection(coll);
//          records.queryOptions('p',1);
//          records.recordsRefresh();
//        }
      }
    }
  }])