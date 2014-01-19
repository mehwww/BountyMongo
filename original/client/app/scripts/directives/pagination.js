/*
 bountyMongo.controller('PaginationController', [
 '$scope',
 '$attrs',
 function ($scope, $attrs) {
 var self = this;

 this.noPrevious = function () {
 return self.page === 1;
 };

 this.noNext = function () {
 return self.page === $scope.totalPages;
 }

 this.isActive = function (page) {
 return self.page === page;
 }

 this.calculateTotalPages = function () {
 var totalPages = self.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
 return Math.max(totalPages || 0, 1);
 };
 }]);
 */

bountyMongo.directive('pagination', function () {
  return {
    restrict: 'E',
    scope: {
      totalItems: '=count',
      currentPage: '='
    },
    templateUrl: './partials/pagination.html',
//    controller: 'PaginationController',
    replace: true,
    link: function (scope, element, attrs) {

      var makePage = function(number, text, isActive, isDisabled) {
        return {
          number: number,
          text: text,
          active: isActive,
          disabled: isDisabled
        };
      }


      scope.$watch('numPages', function (value) {
        scope.pages = [];
        for (var i = 1; i <= value; i++) {
          scope.pages.push(i);
        }
        if (scope.currentPage > value) {
          scope.selectPage(value);
        }
      });

      scope.noPrevious = function () {
        return scope.currentPage === 1;
      };
      scope.noNext = function () {
        return scope.currentPage === scope.numPages;
      };
      scope.isActive = function (page) {
        return scope.currentPage === page;
      };

      scope.selectPage = function (page) {
        if (!scope.isActive(page)) {
          scope.currentPage = page;
        }
      };

      scope.selectPrevious = function () {
        if (!scope.noPrevious()) {
          scope.selectPage(scope.currentPage - 1);
        }
      };
      scope.selectNext = function () {
        if (!scope.noNext()) {
          scope.selectPage(scope.currentPage + 1);
        }
      };
    }
  };
});