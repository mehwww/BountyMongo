describe('state', function () {

    // beforeEach(module('myApp'));

    beforeEach(inject(function (_$rootScope_, _$log_, _$q_) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        $log = _$log_;
        pawel = new Person('Pawel', $log);
        pizzaPit = new Restaurant($q, $rootScope);
        slice = function (pizza) {
            return "sliced " + pizza;
        };
    }));

    it('should illustrate basic usage of $q', function () {
        var pizzaOrderFulfillment = $q.defer();
        var pizzaDelivered = pizzaOrderFulfillment.promise;
        pizzaDelivered.then(pawel.eat, pawel.beHungry);
        pizzaOrderFulfillment.resolve('Margherita');
        $rootScope.$digest();
        expect($log.info.logs).toContain(['Pawel is eating delicious Margherita']);
    });

    it('should illustrate promise rejection', function () {
        var pizzaDelivered = pizzaPit.takeOrder('Capricciosa');
        pizzaDelivered.then(pawel.eat, pawel.beHungry);
        pizzaPit.problemWithOrder('no Capricciosa, only Margherita left');
        expect($log.warn.logs).toContain(['Pawel is hungry because: no Capricciosa, only Margherita left']);
    });

    it('should illustrate successful promise chaining', function () {
        pizzaPit.takeOrder('Margherita').then(slice).then(pawel.eat);
        pizzaPit.deliverOrder();
        expect($log.info.logs).toContain(['Pawel is eating delicious sliced Margherita']);
    });

    it('should illustrate promise rejection in chain', function () {
        pizzaPit.takeOrder('Capricciosa').then(slice).then(pawel.eat, pawel.beHungry);
        pizzaPit.problemWithOrder('no Capricciosa, only Margherita left');
        expect($log.warn.logs).toContain(['Pawel is hungry because: no Capricciosa, only Margherita left']);
    });

    it('should illustrate recovery from promise rejection', function () {
        var retry = function (reason) {
            return pizzaPit.takeOrder('Margherita').then(slice);
        };
        pizzaPit.takeOrder('Capricciosa')
            .then(slice, retry)
            .then(pawel.eat, pawel.beHungry);
        pizzaPit.problemWithOrder('no Capricciosa, only Margherita left');
        pizzaPit.deliverOrder();
        expect($log.info.logs).toContain(['Pawel is eating delicious sliced Margherita']);
    });
});


// describe('state', function() {
//     var mainScope, childScope, grandChildScope;

//     beforeEach(module('scopeInheritance'));

//     beforeEach(inject(function($rootScope, $controller) {
//         mainScope = $rootScope.$new();
//         $controller('MainCtrl', {$scope: mainScope});
//         childScope = mainScope.$new();
//         $controller('ChildCtrl', {$scope: childScope});
//         grandChildScope = childScope.$new();
//         $controller('GrandChildCtrl', {$scope: grandChildScope});
//     }));

//     it('should have over and selected', function() {
//         expect(mainScope.timeOfDay).toBe('morning');
//         expect(mainScope.name).toBe('Nikki');
//         expect(childScope.timeOfDay).toBe('morning');
//         expect(childScope.name).toBe('Mattie');
//         expect(grandChildScope.timeOfDay).toBe('evening');
//         expect(grandChildScope.name).toBe('Gingerbreak Baby');
//     });
// });