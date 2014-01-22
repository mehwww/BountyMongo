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
      var self = this;

//      scope.$watch('currentPage', function (newValue, oldValue) {
//        console.log(newValue)
//        console.log('pages',scope.pages)
//      });

      this.noPrevious = function () {
        return scope.currentPage === 1;
      };
      this.noNext = function () {
        return scope.currentPage === scope.totalPages;
      };
      this.isActive = function (page) {
        return scope.currentPage === page;
      };
      this.calculateTotalPages = function () {
        var itemsPerPage = bucket.paginationConfig.itemsPerPage;
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
          var page = makePage(i, i, this.isActive(i), false);
          pages.push(page);
        }
        if(start>3){
          var page = makePage(0,'...',false,true);
          pages.unshift(page);
          page = makePage(1,1,this.isActive(1),false);
          pages.unshift(page);
        }
        if(end < totalPages -2){
          var page = makePage(0,'...',false,true);
          pages.push(page);
          page = makePage(totalPages,totalPages,this.isActive(totalPages),false);
          pages.push(page);
        }
        //add 'Previous' and 'Next'
        pages.unshift(makePage(currentPage-1,'Previous',false,scope.currentPage === 1))
        pages.push(makePage(currentPage+1,'Next',false,scope.currentPage === scope.totalPages))

        return pages;
      }


//      this.render = function () {
////        console.log('page',this.page);
////        console.log('totalPages',scope.totalPages)
//        scope.currentPage = 1;
////        console.log('totalPages',scope.totalPages)
//        scope.pages = getPages(scope.currentPage, scope.totalPages);
//      };

      scope.selectPage = function(page){
        if(!self.isActive(page) && page>0 && page<= scope.totalPages){
          scope.currentPage = page;
          scope.pages = getPages(scope.currentPage, scope.totalPages);
        }
      }

      scope.$watch('totalItems', function () {
        scope.currentPage = 1;
        scope.totalPages = self.calculateTotalPages();
        scope.pages = getPages(scope.currentPage, scope.totalPages);
      });

//      scope.selectPage = function (page) {
//        if (!scope.isActive(page)) {
//          scope.currentPage = page;
//        }
//      };
//
//      scope.selectPrevious = function () {
//        if (!scope.noPrevious()) {
//          scope.selectPage(scope.currentPage - 1);
//        }
//      };
//      scope.selectNext = function () {
//        if (!scope.noNext()) {
//          scope.selectPage(scope.currentPage + 1);
//        }
//      };
    }
  };
}]);