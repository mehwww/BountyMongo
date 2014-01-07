bountyMongo.factory('databasesResource', [ '$http', function ($http) {
    return function (databaseName) {
        var databasesUrl = 'http://localhost:3000/servers/' + databaseName;
        var Resource = function (data) {
            angular.extend(this, data);
        };
        Resource.query = function () {
            return $http.get(databasesUrl).then(function (response) {
                var result = [];
                angular.forEach(response.data, function (value, key) {
                    result[key] = new Resource(value);
                });
                return result;
            });
        }
        return Resource;
    }
}])
