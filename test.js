const assert = require("assert");
const request = require('supertest');
const application = require("./server.js");

describe("User Controller", function () {
  it("should return 200", function (done) {
    request(application)
      .get("/")
      .expect(200)
      .end(done);
  })
  it("should return a users credentials", function (done) {

    request(application)
      .post("/")
      .send({
        "username": "Chris",
        "password": "Qwer1234"
      })
      .set('Accept', 'application/json')
      .expect((response) => {
        response.header['location'].should.include('/home')
      })
      .end(done);
  })
})


