const elastissearchHelper = require(GENERIC_HELPERS_PATH + "/elastic-search");
let processingUsersTrack = {}
let slackClient = require(ROOT_PATH + "/generics/helpers/slack-communications");
let notificationsHelpers = require(ROOT_PATH + "/module/notifications/in-app/helper")

var messageReceived = function (message) {

  return new Promise(async function (resolve, reject) {

    try {
      debugLogger.info("---------- In notifications consumer -------------");
      let parsedMessage = JSON.parse(message.value)

      if (parsedMessage.action === "deletion") {

        await elastissearchHelper.deleteReadOrUnReadNotificationData(parsedMessage.users, parsedMessage)

      } else if (parsedMessage.action === "versionUpdate") {

        delete parsedMessage.action;
        await elastissearchHelper.updateAppVersion(parsedMessage);

      } else {
        const userId = parsedMessage.user_id
        delete parsedMessage.user_id
        parsedMessage.is_read = false


        const checkifUserIdIsUnderProcessing = function (userId) {
          return (processingUsersTrack[userId]) ? true : false
        }

        let isUserUpdationUnderProcess = checkifUserIdIsUnderProcessing([userId])
        if (!isUserUpdationUnderProcess) {
          processingUsersTrack[userId] = true
          const elasticsearchPushResponse = await elastissearchHelper.pushNotificationData(userId, parsedMessage)
          await notificationsHelpers.pushNotificationMessageToDevice(userId, parsedMessage)
          delete processingUsersTrack[userId]
        } else {
          // repeat with the interval of 1 seconds
          let timerId = setInterval(async () => {
            isUserUpdationUnderProcess = checkifUserIdIsUnderProcessing([userId])
            if (!isUserUpdationUnderProcess) {
              clearInterval(timerId)
              processingUsersTrack[userId] = true
              const elasticsearchPushResponse = await elastissearchHelper.pushNotificationData(userId, parsedMessage)
              await notificationsHelpers.pushNotificationMessageToDevice(userId, parsedMessage)
              delete processingUsersTrack[userId]
            }
          }, 1000);

          // after 50 seconds stop
          setTimeout(() => {
            clearInterval(timerId);
            debugLogger.error(`Failed to process user id - ${userId}`);
          }, 50000);
        }
      }

      return resolve("Message Received");
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
        message: `Kafka server is down on address ${error.address} and on port ${error.port} for notifications`
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
