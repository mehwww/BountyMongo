describe('urlFactory service', function () {
  var urlFactory
  beforeEach(module('bountyMongo'));
  beforeEach(inject(function ($injector) {
    urlFactory = $injector.get('urlFactory')
  }))

  it('should return api url when empty', function () {
    expect(urlFactory()).toBe('/api')
  })

  it('should return packaged url path', function () {
    var paramArray = []
    paramArray.push('serverName')
    expect(urlFactory(paramArray)).toBe('/api/servers/serverName');
    paramArray.push('databaseName')
    expect(urlFactory(paramArray)).toBe('/api/servers/serverName/databases/databaseName');
    paramArray.push('collectionName')
    expect(urlFactory(paramArray)).toBe('/api/servers/serverName/databases/databaseName/collections/collectionName');
  });

  it('should return packaged query string', function () {
    expect(urlFactory([], {p: 1, l: 20})).toBe('/api?p=1&l=20');
    expect(urlFactory([], {s: {_id: 1}})).toBe('/api?s={"_id":1}');
    expect(urlFactory([], {q: {_id: 123, x: {$gt: 123}}})).toBe('/api?q={"_id":123,"x":{"$gt":123}}');
  })
})