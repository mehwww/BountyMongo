bountyMongo.factory('records', [
  '$rootScope',
  'server',
  'database',
  'collection',
  function ($rootScope, server, database, collection) {
    var recordsService = {};

    var server;
    var database;
    var coll;

    var queryOptions = {};

    recordsService.server = function (value) {
      if (value === undefined) return server;
      server = value;
    }
    recordsService.database = function (value) {
      if (value === undefined) return database;
      database = value;
    }
    recordsService.collection = function (value) {
      if (value === undefined) return coll;
      coll = value;
    }
    recordsService.queryOptions = function (key, value) {
      if (key === undefined) return queryOptions;
      if (value === undefined) return queryOptions[key];
      queryOptions[key] = value;
    }

    recordsService.recordsRefresh = function () {
      if (!server)return console.log('need set server');
      if (!database)return console.log('need set database');
      if (!coll)return console.log('need set collection');
      collection(server, database, coll, queryOptions).query().then(function (response) {
        $rootScope.$broadcast('recordsRefresh', response)
      })
    }

    return recordsService;
  }])