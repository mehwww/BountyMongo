bountyMongo.directive('bountyPagination', [

  function () {
    return {
      restrict: 'E',
      scope: {
        currentPage: '=',
        totalItems:'=',
        itemsPerPage:'='
      },
      templateUrl: '/partials/bountyPagination.html',
      replace: true,
      link: function (scope, element, attrs) {

        var isActive = function (page) {
          return scope.currentPage === page;
        };

        var calculateTotalPages = function (totalItems, itemsPerPage) {
          var totalPages = itemsPerPage < 1 ? 1 : Math.ceil(totalItems / itemsPerPage);
          return Math.max(totalPages || 0, 1);
        };

        var makePage = function (number, text, isActive, isDisabled) {
          return {
            number: number,
            text: text,
            active: isActive,
            disabled: isDisabled
          };
        }

        var getPages = function (currentPage, totalPages) {
          if (!totalPages || totalPages === 1)return;
          var pages = [];
          //pagination config : maxsize
          var maxsize = 9;
          var half = Math.ceil(maxsize / 2)
          var min = (currentPage > half) ? Math.max(currentPage - (half - 3), 1) : 1;
          var max = (totalPages - currentPage > half) ? Math.min(currentPage + (half - 3), totalPages) : totalPages;
          var start = (max === totalPages) ? Math.max(totalPages - (maxsize - 3), 1) : min;
          var end = (min === 1) ? Math.min(start + (maxsize - 3), totalPages) : max;

          if (end >= totalPages - 2) {
            end = totalPages;
          }
          if (start <= 3) {
            start = 1;
          }

          for (var i = start; i <= end; i++) {
            var page = makePage(i, i, isActive(i), false);
            pages.push(page);
          }
          if (start > 3) {
            var page = makePage(0, '...', false, true);
            pages.unshift(page);
            page = makePage(1, 1, isActive(1), false);
            pages.unshift(page);
          }
          if (end < totalPages - 2) {
            var page = makePage(0, '...', false, true);
            pages.push(page);
            page = makePage(totalPages, totalPages, isActive(totalPages), false);
            pages.push(page);
          }
          //add 'Previous' and 'Next'
          pages.unshift(makePage(currentPage - 1, 'Previous', false, scope.currentPage === 1))
          pages.push(makePage(currentPage + 1, 'Next', false, scope.currentPage === scope.totalPages))

          return pages;
        }

        scope.selectPage = function (page) {
          if (!isActive(page) && page > 0 && page <= scope.totalPages) {
            scope.currentPage = page;
            scope.pages = getPages(scope.currentPage, scope.totalPages);
          }
        }

        scope.$watch('currentPage', function (newValue,oldValue) {
//          console.log('new',newValue)
//          console.log('old',oldValue)
          scope.pages = getPages(scope.currentPage, scope.totalPages);
        });

        scope.$watch('totalItems', function (newValue) {
          scope.currentPage = 1;
          scope.totalPages =  calculateTotalPages(scope.totalItems,scope.itemsPerPage)
          scope.pages = getPages(scope.currentPage, scope.totalPages);
        });

        scope.$watch('itemsPerPage', function (newValue) {
          scope.currentPage = 1;
          scope.totalPages =  calculateTotalPages(scope.totalItems,scope.itemsPerPage)
          scope.pages = getPages(scope.currentPage, scope.totalPages);
        });
      }
    };
  }]);