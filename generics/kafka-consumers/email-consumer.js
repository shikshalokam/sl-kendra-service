const emailHelper = require(ROOT_PATH + "/generics/helpers/nodemailer");
let slackClient = require(ROOT_PATH + "/generics/helpers/slack-communications");

var messageReceived = function (message, consumer) {

    return new Promise(async function (resolve, reject) {

        try {
            debugLogger.info("---------- In Email Consumer Message Function -------------");
            let parsedMessage = JSON.parse(message.value);

            await emailHelper.sendEmail(parsedMessage, consumer);
            debugLogger.info("---------- Successfully sent mail -------------");
            return resolve("Message Received for email");
        } catch (error) {
            return reject(error);
        }

    });
};

var errorTriggered = function (error) {

    return new Promise(function (resolve, reject) {

        try {
            let errorObject = {
                slackErrorName: "sl-kendra-service",
                color: "#ed2f21",
                message: `Kafka server is down on address ${error.address} and on port ${error.port} for email topic`
            }

            // slackClient.sendErrorMessageToSlack(errorObject)
            return resolve(error);
        } catch (error) {
            return reject(error);
        }

    });
};

module.exports = {
    messageReceived: messageReceived,
    errorTriggered: errorTriggered
};
