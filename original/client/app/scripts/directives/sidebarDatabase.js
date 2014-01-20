bountyMongo.directive('sidebarDatabase', ['database','collection', function (database,collection) {
  return {
    restrict: 'A',
    templateUrl: './partials/sidebarDatabase.html',
    link: function (scope, element, attrs) {
      scope.toggleDatabase = function(){
        scope.isOpen = !scope.isOpen;
        //scope.selectedServer is prototypically inheritance from parent
        database(scope.server,scope.database).query().then(function (response) {
          scope.collectionList = response;
        })
      }
    }
  }

}])