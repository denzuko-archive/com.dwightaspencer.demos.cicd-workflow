var request   = require('supertest'),
    should    = require('should');

describe('Ensure google is online', function () {
    
  var base = "http://www.google.com/";

  it('responds with HTTP status 200 from GET /', function testSlash(done) {
     request(base).get('/')
       .expect(200)
       .end(done);
  });
  
  it('Content-Type of plain/html from GET /', function testContentType(done) {
    request(base).get('/')
      .expect('Content-Type', /html/)
      .end(done);
  });
  
  it('Should return status 200 from GET /robots.txt', function testRobotsText(done) {
    request(base).get('/robots.txt')
      .expect(200)
      .end(done);
  });
});