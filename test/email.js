var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;

describe('Email', function () {

    it('send email status', function (done) {
        chai.request("http://localhost:4202").post('/kendra/api/v1/email/send').type('json').send({
            "from": "aman@tunerlabs.com",
            "to": "amankarki87@gmail.com",
            "cc": ["amankarki76399@gmail.com"],
            "bcc": ["aman@tunerlabs.com"],
            "subject": "Message from nodemailer",
            "html": "<p><b>Hello</b> from Angel Drome!</p>"
        }).end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        })
    });

});