bountyMongo.directive('pagination', ['bucket', function (bucket) {
  return {
    restrict: 'E',
    scope: {
      totalItems: '=',
      currentPage: '='
    },
    templateUrl: './partials/pagination.html',
//    controller: 'PaginationController',
    replace: true,
    link: function (scope, element, attrs) {

      var isActive = function (page) {
        return scope.currentPage === page;
      };

      var calculateTotalPages = function () {
        var itemsPerPage = bucket.queryOptions('l');
        var totalPages = itemsPerPage < 1 ? 1 : Math.ceil(scope.totalItems / itemsPerPage);
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
        if(totalPages===1)return;
        var pages = [];
        var maxsize = bucket.paginationConfig.maxsize;
        var half = Math.ceil(maxsize / 2)
        var min = (currentPage > half) ? Math.max(currentPage - (half - 3), 1) : 1;
        var max = (totalPages - currentPage > half) ? Math.min(currentPage + (half - 3), totalPages) : totalPages;//21
        var start = (max === totalPages) ? Math.max(totalPages - (maxsize - 3), 1) : min;
        var end = (min === 1) ? Math.min(start + (maxsize - 3), totalPages) : max;

        for (var i = start; i <= end; i++) {
          var page = makePage(i, i, isActive(i), false);
          pages.push(page);
        }
        if(start>3){
          var page = makePage(0,'...',false,true);
          pages.unshift(page);
          page = makePage(1,1,isActive(1),false);
          pages.unshift(page);
        }
        if(end < totalPages -2){
          var page = makePage(0,'...',false,true);
          pages.push(page);
          page = makePage(totalPages,totalPages,isActive(totalPages),false);
          pages.push(page);
        }
        //add 'Previous' and 'Next'
        pages.unshift(makePage(currentPage-1,'Previous',false,scope.currentPage === 1))
        pages.push(makePage(currentPage+1,'Next',false,scope.currentPage === scope.totalPages))

        return pages;
      }

      scope.selectPage = function(page){
        if(!isActive(page) && page>0 && page<= scope.totalPages){
          scope.currentPage = page;
          scope.pages = getPages(scope.currentPage, scope.totalPages);
        }
      }

      scope.$watch('currentPage', function () {
        scope.pages = getPages(scope.currentPage, scope.totalPages);
      });

      //so stupid lol XD
      //but enough for a demo
      scope.$watch('totalItems', function () {
        scope.currentPage = 1;
        scope.totalPages = calculateTotalPages();
        scope.pages = getPages(scope.currentPage, scope.totalPages);
      });
      scope.$watch(function(){
        return bucket.queryOptions('l')
      }, function (newVal) {
        scope.currentPage = 1;
        scope.totalPages = calculateTotalPages();
        scope.pages = getPages(scope.currentPage, scope.totalPages);
      });
    }
  };
}]);