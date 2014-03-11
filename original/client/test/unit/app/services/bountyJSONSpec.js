describe('bountyJSON service', function () {
  var bountyJSON
  beforeEach(module('bountyMongo'));
  beforeEach(inject(function ($injector) {
    bountyJSON = $injector.get('bountyJSON')
  }))

  it('should return proper object', function () {
    expect(bountyJSON.parse('{_id: ObjectID("52d616d7cf7734b74670ec9d"),x:1}'))
      .toEqual({_id:{$bountyType: 'ObjectID', $value: '52d616d7cf7734b74670ec9d'},x:1})
    expect(bountyJSON.parse('{date:ISODate("1991-05-23T00:00:00Z"),x:1}'))
      .toEqual({date:{$bountyType: 'ISODate', $value: '1991-05-23T00:00:00.000Z'},x:1})
    expect(bountyJSON.parse('{date:ISODate("1991-05-23T00:00:00Z"),x:1}'))
      .toEqual({date:{$bountyType: 'ISODate', $value: '1991-05-23T00:00:00.000Z'},x:1})
    expect(bountyJSON.parse('{regExp:/^\s*(new\s+)?(Date|RegExp)(\b)/}'))
      .toEqual({regExp:{$bountyType: 'RegExp', $value: {$pattern:'^\s*(new\s+)?(Date|RegExp)(\b)',$flags:null}}})
  })
  it('should return proper string', function () {
    console.log(bountyJSON.stringify({_id:{$bountyType: 'ObjectID', $value: '52d616d7cf7734b74670ec9d'},x:1}))

//    expect(bountyJSON.stringify({_id:{$bountyType: 'ObjectID', $value: '52d616d7cf7734b74670ec9d'},x:1},'',false))
//      .toEqual('{_id: ObjectID("52d616d7cf7734b74670ec9d"),x:1}')
//    expect(bountyJSON.parse('{date:ISODate("1991-05-23T00:00:00Z"),x:1}'))
//      .toEqual({date:{$bountyType: 'ISODate', $value: '1991-05-23T00:00:00.000Z'},x:1})
//    expect(bountyJSON.parse('{date:ISODate("1991-05-23T00:00:00Z"),x:1}'))
//      .toEqual({date:{$bountyType: 'ISODate', $value: '1991-05-23T00:00:00.000Z'},x:1})
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