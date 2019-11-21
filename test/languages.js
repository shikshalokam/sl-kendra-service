var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;

describe('Language Apis', function () {

    it('List language based on id', function (done) {
        chai.request("http://localhost:4202").get('/kendra/api/v1/languages/list/en').end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        })
    });

    it('List all available languages', function (done) {
        chai.request("http://localhost:4202").get('/kendra/api/v1/languages/listAll').end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        })
    });

});