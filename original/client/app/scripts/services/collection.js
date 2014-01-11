bountyMongo.factory('collection', [

    '$http',
    'config',

    function ($http, config) {
        return function () {
            var collection = config.collectionConfig.selected;
            var database = config.databaseConfig.selected;
            var server = config.serverConfig.selected;
            var serverURL = config.serverURL;
            var url = serverURL + 'servers/' + server.host + '/databases/' + database.name + '/collections/' + collection.name;
            var Resource = function (data) {
                angular.extend(this, data);
            };
            Resource.query = function () {
                return $http.get(url).then(function (response) {
                    return response.data.data.find;
                });
            }
            return Resource;
        }
    }])