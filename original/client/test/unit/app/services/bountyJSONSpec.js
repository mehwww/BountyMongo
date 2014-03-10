describe('bountyJSON service', function () {
  var bountyJSON
  beforeEach(module('bountyMongo'));
  beforeEach(inject(function ($injector) {
    bountyJSON = $injector.get('bountyJSON')
  }))

  it('should return proper object', function () {
    expect(bountyJSON.parse('{_id: ObjectID("52d616d7cf7734b74670ec9d"),y:11}'))
      .toEqual({_id:{$bountyType: 'ObjectID', $value: '52d616d7cf7734b74670ec9d'},y:11})
    expect(bountyJSON.parse('{date:ISODate("1991-05-23T00:00:00Z")}'))
      .toEqual({date:{$bountyType: 'ISODate', $value: '1991-05-23T00:00:00.000Z'}})
//    expect(bountyJSON.parse('Date("1991-05-23T00:00:00Z")'))
//      .toEqual({$bountyType: 'ISODate', $value: '1991-05-23T00:00:00.000Z'})
  })
//  it('should return proper string', function () {
//    expect(bountyJSON.stringify({
//      _id: {
//        $bountyType: 'ObjectID',
//        $value: '52d616d7cf7734b74670ec9d'
//      },
//      a: 1
//    }))
//      .toBe('')
//  })
})