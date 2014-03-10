bountyMongo.factory('server', [

  '$http',
  '$q',
  'localStorageService',
  'bountyUrl',

  function ($http, $q, localStorage, bountyUrl) {
    if (!localStorage.get('bounty_servers')) {
      localStorage.add('bounty_servers', [])
    }

    return function (serverName) {
      var serverUrl = ''
      if (typeof serverName !== undefined) {
        serverUrl = localStorage.get('bounty_servers')[serverName]
      }

      var Resource = {};

      Resource.list = function () {
        var deferred = $q.defer();
        var list = [];
        angular.forEach(localStorage.get('bounty_servers'), function (value, key) {
          this.push(key);
        }, list);
        deferred.resolve(list);

        return deferred.promise;
      };

      Resource.query = function () {
        var url = bountyUrl.apiUrl([serverName])
        var config = {headers: {'Mongodb-Url': 'mongodb://' + serverUrl}}
        return $http.get(url, config).then(function (response) {
          return response.data;
        }, function (response) {
          return response.data
        })
      };

      Resource.add = function (mongodbUrl) {
        var serverList = localStorage.get('bounty_servers');
        var server = bountyUrl.mongodbUrl.parse(mongodbUrl)
        if (!angular.isObject(serverList) || angular.isArray(serverList)) serverList = {};
        serverList[server.name] = server.url
        localStorage.add('bounty_servers', serverList)

        var deferred = $q.defer();
        deferred.resolve(server);
        return deferred.promise;
      }

      Resource.delete = function () {
        var url = bountyUrl.apiUrl([serverName])
        var config = {headers: {'Mongodb-Url': 'mongodb://' + serverUrl}}
        var serverList = localStorage.get('bounty_servers');
        delete serverList[serverName];
        localStorage.add('bounty_servers', serverList);

        return $http.delete(url, config).then(function (response) {
          var list = [];
          angular.forEach(serverList, function (value, key) {
            this.push(key);
          }, list);
          return list;
        })
      }

      Resource.databases = function () {
        var url = bountyUrl.apiUrl([serverName]) + '/databases/'
        var config = {headers: {'Mongodb-Url': 'mongodb://' + serverUrl}}
        return $http.get(url, config).then(function (response) {
          var databases = [];
          if (angular.isArray(response.data)) {
            angular.forEach(response.data, function (value, key) {
              this.push(value.name)
            }, databases)
          }
          else {
            databases.push(response.data.db)
          }
          return databases;
        })
      }
      return Resource;
    };
//    return function (server) {
//      var serverURL = bucket.serverURL;
//
//      var url = serverURL + 'servers/' + server.host;
//
////      待研究
////      var Resource = function (data) {
////        angular.extend(this, data);
////      };
//
//      var Resource = {}
//      Resource.query = function () {
//        return $http.get(url).then(function (response) {
//          //返回该服务器上的所有databases
//          return response.data.data;
//        });
//      }
//      return Resource;
//    }
  }])
