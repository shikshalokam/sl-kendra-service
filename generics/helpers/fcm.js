const firebase = require('firebase-admin');
const FCM_KEYSTORE_PATH = (process.env.FCM_KEY_PATH && process.env.FCM_KEY_PATH != "") ? process.env.FCM_KEY_PATH : "/config/fcm-keystore.json"
firebase.initializeApp({
  credential: firebase.credential.cert(ROOT_PATH + FCM_KEYSTORE_PATH)
});
const FCM_SERVER_KEY = (process.env.FCM_SERVER_KEY && process.env.FCM_SERVER_KEY != "") ? process.env.FCM_SERVER_KEY : ""
const topicPrefix = (process.env.NODE_ENV && process.env.NODE_ENV != "") ? process.env.NODE_ENV : "dev"
const Request = require(GENERIC_HELPERS_PATH + '/http-request');
let samikshaThemeColor = process.env.SAMIKSHA_THEME_COLOR ? process.env.SAMIKSHA_THEME_COLOR : "#A63936";

const androidObj = {
  ttl: 3600 * 1000,
  priority: 'high',
  notification: {
    "click_action": "FCM_PLUGIN_ACTIVITY",
    icon: 'stock_ticker_update',
    color: samikshaThemeColor
  }
}

var sendToDevice = function (deviceIds = [], notificatonData = {}) {

  return new Promise(async function (resolve, reject) {
    try {

      let registrationTokens = new Array

      if (Array.isArray(deviceIds) && deviceIds.length < 1) {
        throw new Error("Invalid list of device ids.")
      } else if (Array.isArray(deviceIds)) {
        registrationTokens = deviceIds
      }

      if (typeof (deviceIds) == "string") {
        if (deviceIds == "") throw new Error("Invalid device id.")
        registrationTokens.push(deviceIds)
      }

      if (registrationTokens.length < 1) throw new Error("Invalid list of device ids.")

      let failedTokens = new Array
      let successFullTokens = new Array

      /** TODO
       * Max 500 tokens can be pushed, if more than 500, divide in chunks and send.
      */

      let firebaseResponse = await firebase.messaging().sendMulticast({
        data: notificatonData.data,
        android: androidObj,
        tokens: registrationTokens,
      })

      if (firebaseResponse.failureCount > 0) {
        firebaseResponse.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(registrationTokens[idx]);
          } else if (resp.success) {
            successFullTokens.push(registrationTokens[idx])
          }
        });
      }

      if (failedTokens.length > 0) {
        return resolve({
          success: false,
          message: "Failed to send notification",
          failedDeviceIds: failedTokens,
          // successFullTokens: successFullTokens
        })
      }

      return resolve({
        success: true,
        message: `Notification successfully sent to ${deviceIds}`,
        successFullTokens: successFullTokens
      })

    } catch (error) {
      return reject(error);
    }
  });
};

var sendToTopic = function (topic = "", notificatonData = {}, topicCondition = "") {

  return new Promise(async function (resolve, reject) {
    try {

      let message = {}

      if (topicCondition != "") {
        message = {
          notification: notificatonData,
          condition: condition
        }
      } else if (topic != "") {
        message = {
          data: notificatonData,
          topic: topic
        }
      }

      if (Object.keys(message).length < 1) throw new Error("Invalid topic.")

      try {
        let firebaseResponse = await firebase.messaging().send(message)

        if (firebaseResponse) {
          return resolve({
            success: true,
            message: `Notification successfully sent to topic(s): ${firebaseResponse}`
          })
        } else {
          return resolve({
            success: false,
            message: `Failed to send notification to topic: ${firebaseResponse}`
          })
        }

      } catch (error) {
        return resolve({
          success: false,
          message: `Failed to send notification to topic ${error}`
        })
      }

    } catch (error) {
      return reject(error);
    }
  });
};

var subscribeDeviceToTopic = function (deviceIds = [], topic = "") {

  return new Promise(async function (resolve, reject) {
    try {

      if (topic == "") {
        throw new Error("Invalid topic name.")
      } else {
        topic = topicPrefix + topic
      }

      let registrationTokens = new Array

      if (Array.isArray(deviceIds) && deviceIds.length < 1) {
        throw new Error("Invalid list of device ids.")
      } else if (Array.isArray(deviceIds)) {
        registrationTokens = deviceIds
      }

      if (typeof (deviceIds) == "string") {
        if (deviceIds == "") throw new Error("Invalid device id.")
        registrationTokens.push(deviceIds)
      }

      if (registrationTokens.length < 1) throw new Error("Invalid list of device ids.")

      try {
        let firebaseResponse = await firebase.messaging().subscribeToTopic(registrationTokens, topic)

        if (firebaseResponse) {
          return resolve({
            success: true,
            message: `Successfully subscribed to topic: ${firebaseResponse}`
          })
        } else {
          return resolve({
            success: false,
            message: `Failed to subscribe to topic: ${firebaseResponse}`
          })
        }

      } catch (error) {
        return resolve({
          success: false,
          message: `Failed to subscribe to topic: ${error}`
        })
      }

    } catch (error) {
      return reject(error);
    }
  });
};

var unsubscribeDeviceFromTopic = function (deviceIds = [], topic = "") {

  return new Promise(async function (resolve, reject) {
    try {

      if (topic == "") {
        throw new Error("Invalid topic name.")
      } else {
        topic = topicPrefix + "-" + topic
      }

      let registrationTokens = new Array

      if (Array.isArray(deviceIds) && deviceIds.length < 1) {
        throw new Error("Invalid list of device ids.")
      } else if (Array.isArray(deviceIds)) {
        registrationTokens = deviceIds
      }

      if (typeof (deviceIds) == "string") {
        if (deviceIds == "") throw new Error("Invalid device id.")
        registrationTokens.push(deviceIds)
      }

      if (registrationTokens.length < 1) throw new Error("Invalid list of device ids.")

      try {
        let firebaseResponse = await firebase.messaging().unsubscribeFromTopic(registrationTokens, topic)

        if (firebaseResponse) {
          return resolve({
            success: true,
            message: `Successfully unsubscribed from topic: ${firebaseResponse}`
          })
        } else {
          return resolve({
            success: false,
            message: `Failed to unsubscribe from topic: ${firebaseResponse}`
          })
        }

      } catch (error) {
        return resolve({
          success: false,
          message: `Failed to unsubscribe from topic: ${error}`
        })
      }

    } catch (error) {
      return reject(error);
    }
  });
};

var getDeviceIdInformation = function (deviceId = "") {

  return new Promise(async (resolve, reject) => {
    try {

      if (FCM_SERVER_KEY == "") throw new Error("Missing FCM_SERVER_KEY.")

      if (deviceId == "") throw new Error("Invalid device id.")

      let reqObj = new Request()

      let response = await reqObj.get(
        "https://iid.googleapis.com/iid/info/" + deviceId + "?details=true",
        {
          "headers": {
            "Authorization": `key=${FCM_SERVER_KEY}`
          }
        }
      )

      return resolve(response)

    } catch (error) {
      return reject(error);
    }
  })

};

var sendToAndroid = function (deviceIds = [], notificatonData = {}) {

  return new Promise(async function (resolve, reject) {
    try {

      let registrationTokens = new Array

      if (Array.isArray(deviceIds) && deviceIds.length < 1) {
        throw new Error("Invalid list of device ids.")
      } else if (Array.isArray(deviceIds)) {
        registrationTokens = deviceIds
      }

      if (typeof (deviceIds) == "string") {
        if (deviceIds == "") throw new Error("Invalid device id.")
        registrationTokens.push(deviceIds)
      }

      if (registrationTokens.length < 1) throw new Error("Invalid list of device ids.")

      let failedTokens = new Array
      let successFullTokens = new Array

      /** TODO
      * Max 500 tokens can be pushed, if more than 500, divide in chunks and send.
     */

      let firebaseResponse = await firebase.messaging().sendMulticast({
        android: notificationData,
        tokens: registrationTokens,
      })

      if (firebaseResponse.failureCount > 0) {
        firebaseResponse.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(registrationTokens[idx]);
          } else if (resp.success) {
            successFullTokens.push(registrationTokens[idx])
          }
        });
      }

      if (failedTokens.length > 0) {
        return resolve({
          success: false,
          message: "Failed to send notification",
          failedDeviceIds: failedTokens,
          // successFullTokens: successFullTokens
        })
      }

      return resolve({
        success: true,
        message: `Notification successfully sent to ${deviceIds}`,
        successFullTokens: successFullTokens
      })

    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = {
  sendToDevice: sendToDevice,
  sendToTopic: sendToTopic,
  sendToAndroid: sendToAndroid,
  subscribeDeviceToTopic: subscribeDeviceToTopic,
  unsubscribeDeviceFromTopic: unsubscribeDeviceFromTopic,
  getDeviceIdInformation: getDeviceIdInformation
};
