bountyMongo.factory('records', [
  '$rootScope',
  'server',
  'database',
  'collection',
  function ($rootScope, server, database, collection) {
    var recordsService = {};

    var queryOptions = {};

    recordsService.queryOptions = function (key, value) {
      if (key === undefined) return queryOptions;
      if (value === undefined) return queryOptions[key];
      queryOptions[key] = value;
    }

    recordsService.recordsRefresh = function(){
      var server = queryOptions.server;
      var database = queryOptions.database;
      var coll = queryOptions.collection;
      if(!coll)return;
      collection(server,database,coll,queryOptions).query().then(function (response) {
        $rootScope.$broadcast('recordsRefresh',response)
      })
    }
  }])