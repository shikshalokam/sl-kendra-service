const elastissearchHelper = require(GENERIC_HELPERS_PATH + "/elastic-search");
let slackClient = require(ROOT_PATH + "/generics/helpers/slack-communications");

var messageReceived = function (message) {

  return new Promise(async function (resolve, reject) {

    try {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> ade398aad48b6fec4ea1a08abde47018437cef4f
      debugLogger.info("---------- In Language Pack Consumer Message Function -------------");
      let parsedMessage = JSON.parse(message.value);

      if (parsedMessage.action === "language") {
=======
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
<<<<<<< HEAD
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
>>>>>>> ade398aad48b6fec4ea1a08abde47018437cef4f
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
      console.log("---------- In Consumer Message Function -------------")
      let parsedMessage = JSON.parse(message.value);

      if (parsedMessage.action === "language") {
        console.log(parsedMessage);
        console.log("elastic search");
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
=======
>>>>>>> ade398aad48b6fec4ea1a08abde47018437cef4f
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
        const id = parsedMessage.id;
        delete parsedMessage.id;
        delete parsedMessage.action;

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> ade398aad48b6fec4ea1a08abde47018437cef4f
        await elastissearchHelper.pushLanguageData(id, parsedMessage);
        debugLogger.info("---------- Language Pack Consumer Ends -------------");
      }

=======
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
<<<<<<< HEAD
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
>>>>>>> ade398aad48b6fec4ea1a08abde47018437cef4f
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
        await elastissearchHelper.pushLanguageData(id, parsedMessage)
      }

      console.log("------------ Language Pack ----------", parsedMessage)
      console.log("In Language pack");
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
=======
>>>>>>> ade398aad48b6fec4ea1a08abde47018437cef4f
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
      return resolve("Message Received for language pack");
    } catch (error) {
      return reject(error);
    }

  });
};

var errorTriggered = function (error) {

  return new Promise(function (resolve, reject) {

    try {
      let errorObject = {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> ade398aad48b6fec4ea1a08abde47018437cef4f
        slackErrorName: "sl-kendra-service",
        color: "#ed2f21",
        message: `Kafka server is down on address ${error.address} and on port ${error.port} for language pack`
      }

      // slackClient.sendErrorMessageToSlack(errorObject)
=======
        message: `Kafka server is down on address ${error.address} and on port ${error.port} for language pack`
      }
      slackClient.kafkaErrorAlert(errorObject)
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
<<<<<<< HEAD
        message: `Kafka server is down on address ${error.address} and on port ${error.port} for language pack`
      }
      slackClient.kafkaErrorAlert(errorObject)
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
        message: `Kafka server is down on address ${error.address} and on port ${error.port} for language pack`
      }
      slackClient.kafkaErrorAlert(errorObject)
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
=======
>>>>>>> ade398aad48b6fec4ea1a08abde47018437cef4f
        message: `Kafka server is down on address ${error.address} and on port ${error.port} for language pack`
      }
      slackClient.kafkaErrorAlert(errorObject)
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
        message: `Kafka server is down on address ${error.address} and on port ${error.port} for language pack`
      }
      slackClient.kafkaErrorAlert(errorObject)
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
        message: `Kafka server is down on address ${error.address} and on port ${error.port} for language pack`
      }
      slackClient.kafkaErrorAlert(errorObject)
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
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
