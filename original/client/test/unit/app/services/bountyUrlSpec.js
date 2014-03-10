describe('bountyUrl service', function () {
  var bountyUrl
  beforeEach(module('bountyMongo'));
  beforeEach(inject(function ($injector) {
    bountyUrl = $injector.get('bountyUrl')
  }))

  it('should return api url when empty', function () {
    expect(bountyUrl.url()).toBe('')
    expect(bountyUrl.apiUrl()).toBe('/api')
  })

  it('should return packaged url path', function () {
    var paramArray = []
    paramArray.push('serverName')
    expect(bountyUrl.url(paramArray)).toBe('/servers/serverName');
    expect(bountyUrl.apiUrl(paramArray)).toBe('/api/servers/serverName');
    paramArray.push('databaseName')
    expect(bountyUrl.url(paramArray)).toBe('/servers/serverName/databases/databaseName');
    expect(bountyUrl.apiUrl(paramArray)).toBe('/api/servers/serverName/databases/databaseName');
    paramArray.push('collectionName')
    expect(bountyUrl.url(paramArray)).toBe('/servers/serverName/databases/databaseName/collections/collectionName');
    expect(bountyUrl.apiUrl(paramArray)).toBe('/api/servers/serverName/databases/databaseName/collections/collectionName');
    paramArray.push('/extraPart')
    expect(bountyUrl.url(paramArray)).toBe('/servers/serverName/databases/databaseName/collections/collectionName/extraPart');
    expect(bountyUrl.apiUrl(paramArray)).toBe('/api/servers/serverName/databases/databaseName/collections/collectionName/extraPart');
    delete paramArray[2]
    expect(bountyUrl.url(paramArray)).toBe('/servers/serverName/databases/databaseName/extraPart');
    expect(bountyUrl.apiUrl(paramArray)).toBe('/api/servers/serverName/databases/databaseName/extraPart');
    delete paramArray[0]
    expect(bountyUrl.url(paramArray)).toBe('/databases/databaseName/extraPart');
    expect(bountyUrl.apiUrl(paramArray)).toBe('/api/databases/databaseName/extraPart');
  });

  it('should return packaged query string', function () {
    expect(bountyUrl.apiUrl([], {p: 1, l: 20})).toBe('/api?p=1&l=20');
    expect(bountyUrl.apiUrl([], {s: {_id: 1}})).toBe('/api?s={"_id":1}');
    expect(bountyUrl.apiUrl([], {q: {_id: 123, x: {$gt: 123}}})).toBe('/api?q={"_id":123,"x":{"$gt":123}}');
  })

  it('should parse a mongodb url', function () {
    var url = 'root:1234567@localhost'
    expect(bountyUrl.mongodbUrl.parse(url)).toEqual({name: 'root@localhost', url: 'root:1234567@localhost'})
    url = 'testUser:1234567@127.0.0.1/test'
    expect(bountyUrl.mongodbUrl.parse(url)).toEqual({name: 'testUser@127.0.0.1/test', url: 'testUser:1234567@127.0.0.1/test'})
  })
})