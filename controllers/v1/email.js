/**
 * name : email.js
 * author : Aman Jung Karki
 * created-date : 03-Dc-2019
 * Description : Email.
 */


/**
 * Load email helper. Email helper functionality includes:
 * 1. Send email data to kafka.
 */

let emailHelpers = require(ROOT_PATH + "/module/email/helper.js");

module.exports = class Email {

    /**
     * @apiDefine errorBody
     * @apiError {String} status 4XX,5XX
     * @apiError {String} message Error
     */

    /**
     * @apiDefine successBody
     *  @apiSuccess {String} status 200
     * @apiSuccess {String} result Data
     */


    static get name() {
        return "email";
    }

    /**
* @api {post} /kendra/api/v1/email/send send email to users
* @apiVersion 1.0.0
* @apiName email send email to users
* @apiGroup Language
* @apiHeader {String} X-authenticated-user-token Authenticity token
* @apiSampleRequest /kendra/api/v1/email/send
* @apiParam {File} email Mandatory email file of type CSV.
* @apiUse successBody
* @apiUse errorBody
* @apiParamExample {json} Request:
* {
	"from": "example@example.com",
	"to": "example1@example.com",
	"cc": ["example2@example.com"],
	"bcc": ["example3@example.com"],
	"subject": "Regarding nodemailer",
	"text": "First Text",
	"html":"<p><b>Hello</b> from Angel Drome!</p>"
}
*/

    /**
        * send email notifications.
    */

    send(req) {

        return new Promise(async (resolve, reject) => {

            try {

                await emailHelpers.send(req.body);

                return resolve({
                    message: "Email sent successfully"
                })

            } catch (error) {

                return reject({
                    status: error.status || httpStatusCode["internal_server_error"].status,
                    message: error.message || httpStatusCode["internal_server_error"].message
                })

            }


        })
    }

};

