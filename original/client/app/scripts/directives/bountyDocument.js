bountyMongo.directive('bountyDocument', [function () {
  return {
    restrict: 'E',
    scope: {
      document: '='
    },
    templateUrl: '/partials/bountyDocument.html',
    replace: true,
    link: function (scope, element, attr) {

    }
  }
}])