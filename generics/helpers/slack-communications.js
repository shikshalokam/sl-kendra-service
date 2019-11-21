const Request = require('./http-request');
const slackCommunicationsOnOff = process.env.SLACK_COMMUNICATIONS_ON_OFF
const slackToken = process.env.SLACK_TOKEN
const exceptionLogPostUrl = process.env.SLACK_EXCEPTION_LOG_URL;
const errorMessageToSlack = (!process.env.ERROR_MESSAGE_TO_SLACK || !process.env.ERROR_MESSAGE_TO_SLACK != "OFF") ? "ON" : "OFF";

const sendErrorMessageToSlack = function (errorMessage) {
  return new Promise(async (resolve, reject) => {
    try {

      if (slackCommunicationsOnOff === "ON" && errorMessageToSlack === "ON" && slackToken != "") {

        const reqObj = new Request()
        let attachmentData = new Array
        let fieldsData = new Array

        Object.keys(errorMessage).forEach(objValue => {

          if (objValue !== "slackErrorName" && objValue !== "color") {
            fieldsData.push({
              title: objValue,
              value: errorMessage[objValue],
              short: false
            })
          }
        })


        fieldsData.push({
          title: "Environment",
          value: process.env.NODE_ENV,
          short: false
        })

        let attachment = {
          color: errorMessage.color,
          pretext: errorMessage,
          text: "More information below",
          fields: fieldsData
        }
        attachmentData.push(attachment)

        var options = {
          json: {
            text: errorMessage.slackErrorName,
            attachments: attachmentData
          }
        }

        let sendMessageToSlack = await reqObj.post(
          exceptionLogPostUrl,
          options
        )

        if (sendMessageToSlack.data !== "ok") {
          throw Error("Slack message was not posted")
        }

<<<<<<< HEAD
        return resolve({
=======
  } else {
    return {
      success: false,
      message: "Slack configuration is not done"
    }
  }
}

const pushNotificationError = function (errorMessage) {
  if (slackCommunicationsOnOff === "ON" && sendPushNotificationsErrorMessagesToSlack === "ON" && slackToken != "") {

    const reqObj = new Request()
    let attachmentData = new Array
    let fieldsData = new Array


    Object.keys(errorMessage).forEach(objValue => {
      fieldsData.push({
        title: objValue,
        value: errorMessage[objValue],
        short: false
      })
    })


    fieldsData.push({
      title: "Environment",
      value: process.env.NODE_ENV,
      short: false
    })

    let attachment = {
      color: "#fa3e3e",
      pretext: errorMessage,
      text: "More information below",
      fields: fieldsData
    }
    attachmentData.push(attachment)

    var options = {
      json: {
        text: "Push Notifications Error Logs",
        attachments: attachmentData
      }
    }


    let returnResponse = {}

    new Promise((resolve, reject) => {
      return resolve(reqObj.post(
        exceptionLogPostUrl,
        options
      ));
    }).then(result => {
      if (result.data === "ok") {
        returnResponse = {
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
          success: true,
          message: "Slack message posted."
        });

      } else {
        return resolve({
          success: false,
          message: "Slack configuration is not done"
        })
      }
    } catch (error) {
      return reject(error)
    }
  })
}

module.exports = {
  sendErrorMessageToSlack: sendErrorMessageToSlack
};

