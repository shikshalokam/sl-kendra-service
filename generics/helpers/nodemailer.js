/**
 * name : nodemailer.js
 * author : Aman Jung Karki
 * created-date : 03-Dc-2019
 * Description : Email related helpers.
 */


/**
 * Load Module.
 */

let slackClient = require(ROOT_PATH + "/generics/helpers/slack-communications");

/**
* Nodemailer Send consumer mail to nodemailer mail functionality.
*/

function sendEmail(SingleMessage, consumer = "") {
    return new Promise(async (resolve, reject) => {

        let emailData;

        if (SingleMessage.count) {
            emailData = await send(_.omit(SingleMessage, ["count"]))
        } else {
            emailData = await send(SingleMessage)
        };

        let response = {
            success: false
        };

        if (emailData.success) {
            consumer.commitOffsets(true)
            response.success = true;
        } else {

            if (!SingleMessage.count) {
                SingleMessage["count"] = 1;
            } else {
                SingleMessage["count"] += 1;
            }

            if (SingleMessage.count < 10) {
                await sendEmail(SingleMessage, consumer);

                /**
                 * Commented for testing purpose.
                 */

                // await sendEmail(SingleMessage);
            } else {

                let errorMsg = {};
                errorMsg["slackErrorName"] = "Nodemailer error !!";
                errorMsg["Environment"] = process.env.NODE_ENV || "testing";
                errorMsg["error"] = emailData.error.message;
                errorMsg["color"] = "#ed2f21";
                slackClient.sendErrorMessageToSlack(errorMsg)
            }
        }

        return resolve(response)

    })
}

/**
* Nodemailer Send mail functionality.
*/

function send(SingleMail) {
    return new Promise(async (resolve, reject) => {

        let message = {
            from: SingleMail.from,
            to: SingleMail.to,
            subject: SingleMail.subject,
            text: SingleMail.text,
            html: SingleMail.html
        }

        if (SingleMail.cc && Array.isArray(SingleMail.cc)) {
            message["cc"] = SingleMail.cc
        }

        if (SingleMail.bcc) {
            message["cc"] = SingleMail.bcc
        }

        smtpServer.sendMail(message, (err, info) => {

            let response = {};

            if (err) {
                response["success"] = false;
                response["error"] = err;

                debugLogger.error("Error occurred." + err.message);
            }

            if (info && info.accepted && info.accepted.length > 0) {
                response["success"] = true;
            }

            return resolve(response)
        });

    })
}

module.exports = {
    sendEmail: sendEmail
}
