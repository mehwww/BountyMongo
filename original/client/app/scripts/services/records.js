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
    recordsService.initQueryOptions = function () {
      queryOptions = {}
    }


    recordsService.recordsRefresh = function () {
//      console.log('server',server)
//      console.log('database',database)
//      console.log('collection',coll)
      if (!server)return;
      if (!database)return;
      if (!coll)return;
//      console.log('aaa')
      collection(server, database, coll, queryOptions).query().then(function (response) {
        $rootScope.$broadcast('recordsRefresh', response)
      })
    }

    return recordsService;
  }])