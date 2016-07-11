var request = require('supertest'),
    config  = require('../config'),
    uxServer = require('../client');

describe('loading ux express', function () {
  var server;
  
  beforeEach(function () {
    server = new uxServer(config);
  });
  
  afterEach(function () {
    server.close();
  });
  
  it('responds to GET /', function testUxSlash(done) {
      request(server)
        .get('/')
        .expect(200, done);
  });
  
  it('responds with 404 on everything else', function testUxPath(done) {
      request(server)
        .get('/foo/bar')
        .expect(404, done);
  });
});