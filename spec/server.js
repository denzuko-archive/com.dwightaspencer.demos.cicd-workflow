var request   = require('supertest'),
    config    = require('../config'),
    apiServer = require('../server');

describe('loading api express', function () {
  var server;
  
  beforeEach(function () {
    server = new apiServer(config);
  });
  
  afterEach(function () {
    server.close();
  });
  
  it('responds to GET /', function testApiSlash(done) {
      request(server)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200, done);
  });
  
  it('responds to GET /v1', function testVersionEndpoint(done) {
      request(server)
        .get('/v1')
        .expect('Content-Type', /json/)
        .expect(200, done);
  });
  
  it('should return json on GET /v1', function testJsonReturnOnRoot(done) {
      request(server)
        .get('/v1')
        .expect('Content-Type', /json/)
        .expect(200, done);
  });
  
  it('responds with 404 on everything else', function testApiPath(done) {
      request(server)
        .get('/testing/regression/')
        .expect(404, done);
  });
});