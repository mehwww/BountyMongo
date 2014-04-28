describe('pagination directive', function () {
  var $scope, element, lis;
  beforeEach(module('bountyMongo'));
  beforeEach(inject(function ($compile, $rootScope, $templateCache) {
    $templateCache.put('/partials/bountyPagination.html', window.__html__['app/partials/bountyPagination.html']);
    $scope = $rootScope;
    element = angular.element('<bounty-pagination current-page="page" total-items="count" items-per-page="pageSize"></bounty-pagination>')
    $compile(element)($scope)
    $scope.$apply(function () {
      $scope.count = 100;
      $scope.pageSize = 20;
    })
    lis = function () {
      return element.find('li');
    };
  }));

  it('has a "pagination" css class', function () {
    expect(element.hasClass('pagination')).toBe(true);
  });

  it('is 1 ul element contains num-pages + 2 li elements', function () {
    expect(element.prop('tagName').toLowerCase()).toBe('ul');
    expect(lis().length).toBe(7);
    expect(lis().eq(0).find('a').text()).toBe('Previous');
    expect(lis().eq(-1).find('a').text()).toBe('Next');
  });

  it('has the number of the page as text in each page item', function () {
    var totalPages = Math.ceil($scope.count / $scope.pageSize);
    for (var i = 1; i <= totalPages; i++) {
      expect(lis().eq(i).find('a').text()).toEqual('' + i);
    }
  });

  it('sets the current page to be active', function () {
    var currentPageItem = lis().eq($scope.page);
    expect(currentPageItem.hasClass('active')).toBe(true);
  });

  it('disables the "previous" link if current page is 1', function () {
    $scope.$apply(function () {
      $scope.page = 1;
    })
    expect(lis().eq(0).hasClass('disabled')).toBe(true);
  });

  it('disables the "next" link if current page is num pages', function () {
    $scope.$apply(function () {
      $scope.page = 5;
    })
    expect(lis().eq(-1).hasClass('disabled')).toBe(true);
  });

  it('changes current page if a page link is clicked', function () {
    var page3 = lis().eq(3).find('a');
    page3.click();
    expect($scope.page).toBe(3);
  });

  it('does not change the current page on "previous" click if already at first page', function () {
    $scope.$apply(function () {
      $scope.page = 3;
    })
    lis().eq(0).find('a').click();
    expect($scope.page).toBe(2);

    $scope.$apply(function () {
      $scope.page = 1;
    })
    lis().eq(0).find('a').click();
    expect($scope.page).toBe(1);
  });

  it('does not change the current page on "next" click if already at last page', function () {
    $scope.$apply(function () {
      $scope.page = 3;
    })
    lis().eq(-1).find('a').click()
    expect($scope.page).toBe(4);

    $scope.$apply(function () {
      $scope.page = 5;
    })
    lis().eq(-1).find('a').click();
    expect($scope.page).toBe(5);
  });

  describe('only have one page: ', function () {
    beforeEach(function () {
      $scope.$apply(function () {
        $scope.count = 20
      })
    })

    it('have no li', function () {
      expect(lis().length).toBe(0)
    })
  })

  describe('have many pages: ', function () {
    beforeEach(function () {
      $scope.$apply(function () {
        $scope.count = 1000
      })
    })

    it('have 9+2 lis', function () {
      expect(lis().length).toBe(11)
    })

    it('last page text should be the last page num and the penultimate page text should be "..." ', function () {
      expect(lis().eq(-2).find('a').text()).toBe('' + 50);
      expect(lis().eq(-3).find('a').text()).toBe('...');
      expect(lis().eq(-4).find('a').text()).toBe('' + 7);
    })

    it('first page text should be 1 and the second page text should be "..." ', function () {
      $scope.$apply(function(){
        $scope.page = 50
      })
      expect(lis().eq(1).find('a').text()).toBe('' + 1);
      expect(lis().eq(2).find('a').text()).toBe('...');
      expect(lis().eq(3).find('a').text()).toBe('' + 44);
    })

    it('in middle',function(){
      $scope.$apply(function(){
        $scope.page = 25
      })
      expect(lis().eq(1).find('a').text()).toBe('' + 1);
      expect(lis().eq(2).find('a').text()).toBe('...');
      expect(lis().eq(3).find('a').text()).toBe('' + (25-2));

      expect(lis().eq(-2).find('a').text()).toBe('' + 50);
      expect(lis().eq(-3).find('a').text()).toBe('...');
      expect(lis().eq(-4).find('a').text()).toBe('' + (25+2));
    })
  })
})