var request = require('supertest');

describe('loading ux express', function () {
  var server, serverClass, config;
  
  beforeEach(function () {
    config = require('../config');
    serverClass = require('../client');
    server = new serverClass(config);
  });
  
  afterEach(function () {
    server.close();
  });
  
  it('responds to GET /', function testSlash(done) {
      request(server)
        .get('/')
        .expect(200, done);
  });
  
  it('responds with 404 on everything else', function testPath(done) {
      request(server)
        .get('/foo/bar')
        .expect(404, done);
  });
});