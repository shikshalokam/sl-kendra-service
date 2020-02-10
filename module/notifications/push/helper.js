/**
 * name : module/notifications/push/helper.js
 * author : Aman Jung Karki
 * Date : 15-Nov-2019
 * Description : Push Notifications helper.
 */


// dependencies

const fcmNotification = require('fcm-notification');
const FCM_KEY_PATH = gen.utils.checkIfEnvDataExistsOrNot("FCM_KEY_PATH");
const fcm_token_path = require(ROOT_PATH + FCM_KEY_PATH);
const FCM = new fcmNotification(fcm_token_path);
const NODE_ENV = gen.utils.checkIfEnvDataExistsOrNot("NODE_ENV"); 
const slackClient = require(ROOT_PATH + "/generics/helpers/slack-communications");
const userExtensionHelper = require(MODULES_BASE_PATH + "/user-extension/helper");

/**
    * PushNotificationsHelper
    * @class
*/

module.exports = class PushNotificationsHelper {

       /**
      * Push data to topic.
      * @method
      * @name pushToTopic
      * @param {Object} element - element 
      * @param {String} element.topicName - topicName
      * @param {String} element.title - title
      * @param {String} element.message - message
      * @returns {Promise} returns a promise.
     */

    static pushToTopic(notification) {
        return new Promise(async (resolve, reject) => {
            try {

                let pushNotificationRelatedInformation = {
                    topic: notification.topicName,
                    notification: {
                        title: notification.title,
                        body: notification.message
                    }
                };

                let pushToTopicData = 
                await _sendMessage(pushNotificationRelatedInformation);

                return resolve(pushToTopicData);

            } catch (error) {
                return reject(error);
            }
        })
    }


     /**
      * Subscribe to topic.
      * @method
      * @name subscribeToTopic
      * @param {Object} subscribeData - Subscription data.
      * @param {String} subscribeData.deviceId - notification device Id.
      * @param {String} subscribeData.topic - topic of subscription data.                     
      * @returns {Promise} returns a promise.
     */

    static subscribeToTopic(subscribeData) {

        return new Promise(async (resolve, reject) => {

            try {

                let success;

                FCM.subscribeToTopic(subscribeData.deviceId, 
                    NODE_ENV + "-" + subscribeData.topic, 
                    function (err, response) {
                        if (err) {
                            success = false;
                            slackClient.sendMessageToSlack({
                                "code": err.errorInfo.code,
                                "message": err.errorInfo.message,
                                slackErrorName: gen.utils.checkIfEnvDataExistsOrNot("SLACK_ERROR_NAME"),
                                color: gen.utils.checkIfEnvDataExistsOrNot("SLACK_ERROR_MESSAGE_COLOR")
                            });

                    } else {
                        success = true;
                    }

                    return resolve({
                        success: success
                    });
                })

            } catch (error) {
                return reject(error);
            }


        })

    }

    /**
      * UnSubscribe from topic.
      * @method
      * @name unsubscribeFromTopic
      * @param {Object} unsubscribeData - UnSubscription data.
      * @param {String} subscribeData.deviceId - notification device Id.
      * @param {String} subscribeData.topic - topic of subscription data.                     
      * @returns {Promise} returns a promise.
     */

    static unsubscribeFromTopic(unsubscribeData) {

        return new Promise(async (resolve, reject) => {

            try {

                let success;

                FCM.unsubscribeFromTopic(unsubscribeData.deviceId, 
                    NODE_ENV + "-" + unsubscribeData.topic, 
                    function (err, response) {
                        if (err) {
                            success = false;

                            slackClient.sendMessageToSlack({
                                "code": err.errorInfo.code,
                                "message": err.errorInfo.message,
                                slackErrorName: gen.utils.checkIfEnvDataExistsOrNot("SLACK_ERROR_NAME"),
                                color: gen.utils.checkIfEnvDataExistsOrNot("SLACK_ERROR_MESSAGE_COLOR"),
                            });

                    } else {
                        success = true;
                    }

                    return resolve({
                        success: success
                    });
                })


            } catch (error) {
                return reject(error);
            }


        })

    }

    /**
      * Push data to all users.
      * @method
      * @name pushData
      * @param {Object} allUserData - Notification that need to a given android.
      * @param {String} allUserData.topicName - topicName of notification.
      * @param {String} allUserData.message - message of notification.   
      * @param {String} allUserData.title - title of notifications.                                           
      * @returns {Promise} returns a promise.
     */

    static pushData(allUserData) {
        return new Promise(async (resolve, reject) => {
            try {

                if (!allUserData.topicName) {
                    throw "topic name is required"
                }

                if (allUserData.message && allUserData.title) {
                    let topicResult = await this.pushToTopic(allUserData);

                    if (topicResult !== undefined && topicResult.success) {

                        allUserData.status = "success";

                    } else {
                        allUserData.status = "Fail";
                    }
                }
                else {
                    allUserData.status = "Message or title is not present in csv.";
                }


                return resolve(allUserData);

            } catch (error) {
                return reject(error);
            }
        })
    }

    /**
      * Subscribe or unsubscribe data.
      * @method
      * @name subscribeOrUnSubscribeData
      * @param {Object} subscribeOrUnSubscribeData - Notification that need to a given android.
      * @param {String} subscribeOrUnSubscribeData.userId - Logged in user.
      * @param {String} subscribeOrUnSubscribeData.appName - appName.   
      * @param {String} subscribeOrUnSubscribeData.os - os.
      * @param {String} subscribeOrUnSubscribeData.topicName - topicName.
      * @param {String} [subscribeToTopic = false] - subscribe to topic or not.                                                 
      * @returns {Promise} returns a promise.
     */

    static subscribeOrUnSubscribeData(subscribeOrUnSubscribeData, subscribeToTopic = false) {
        return new Promise(async (resolve, reject) => {
            try {

                let userProfile = await userExtensionHelper.userExtensionDocument({
                    userId: subscribeOrUnSubscribeData.userId,
                    status: "active",
                    isDeleted: false
                }, {
                        devices: 1
                    });

                let deviceStatus;

                if (subscribeToTopic) {
                    deviceStatus = "active";
                } else {
                    deviceStatus = "inactive";
                }


                let subscribedOrUnSubscribed = [];

                if (userProfile && userProfile.devices.length > 0) {

                    let matchedDevices = userProfile.devices.filter(eachUserDevice => {
                        if (eachUserDevice.app == subscribeOrUnSubscribeData.appName && 
                            eachUserDevice.os == subscribeOrUnSubscribeData.os && 
                            eachUserDevice.status === deviceStatus) {
                              return eachUserDevice;
                        }
                    })

                    if (matchedDevices.length > 0) {

                        await Promise.all(userProfile.devices.map(async device => {

                            device.topic = subscribeOrUnSubscribeData.topicName;

                            let result;

                            if (subscribeToTopic) {
                                result = await this.subscribeToTopic(device);
                            } else {
                                result = await this.unsubscribeFromTopic(device);
                            }

                            if (result !== undefined && result.success) {
                                subscribeOrUnSubscribeData.status = subscribeToTopic ? 
                                "successfully subscribed" : 
                                "successfully unsubscribed";

                            } else {
                                subscribeOrUnSubscribeData.status = subscribeToTopic ? 
                                "Fail to subscribe" : 
                                "Fail to unsubscribe";
                            }

                            subscribedOrUnSubscribed.push(subscribeOrUnSubscribeData);
                        }))

                    } else {
                        subscribeOrUnSubscribeData.status = 
                        "App name could not be found or status is inactive";

                        subscribedOrUnSubscribed.push(subscribeOrUnSubscribeData);
                    }

                } else {
                    subscribeOrUnSubscribeData.status = "No devices found.";

                    subscribedOrUnSubscribed.push(subscribeOrUnSubscribeData);
                }

                return resolve(subscribeOrUnSubscribeData);

            } catch (error) {
                return reject(error);
            }
        })
    }

      /**
      * Send not
      * @method
      * @name sendNotificationsToBodh
      * @param {Object} notificationData - Notification data to be sent.                                                 
      * @returns {Promise} returns a promise.
     */

    static pushToUsers( notificationsData,devices,userId,topicName = "" ) {
        return new Promise(async (resolve, reject) => {
            try {

                let userInfo = new Array;

                for(let pointerToDevices = 0;
                    pointerToDevices<devices.length;
                    pointerToDevices++
                ) {
                    let userInfoData = {};

                    notificationsData["deviceId"] = 
                    devices[pointerToDevices].deviceId;

                    let pushNotificationInAndroid = 
                    await this.sendNotifications(
                        notificationsData,
                        devices,
                        userId,
                        devices[pointerToDevices].os
                    );

                    userInfoData["deviceId"] = 
                    devices[pointerToDevices].deviceId;

                    if (!pushNotificationInAndroid.success) {

                        userInfoData["success"] = false; 

                    } else {
                        userInfoData["success"] = true;
                        
                        if(topicName !== "") {
                            let subscribeData = {
                                deviceId : devices[pointerToDevices].deviceId,
                                topic : topicName
                            }
                            await this.subscribeToTopic(subscribeData)
                        }
                    }

                    userInfo.push(userInfoData);
                }

                const pushedStatus = userInfo.some(userDevice=>{
                    return userDevice.success
                });

                return resolve(pushedStatus);

            } catch (error) {
                return reject(error);
            }
        })
    }

      /**
      * Send notifications to android or ios
      * @method
      * @name sendNotifications
      * @param {Object} notificationData - Notification data to be sent.                                                 
      * @returns {Promise} returns a promise.
     */

    static sendNotifications(notificationData,devices,userId,os) {
        return new Promise(async (resolve, reject) => {
            try {
                
                let response = await _createNotificationInAndroidOrIos(
                    notificationData,
                    devices,
                    userId
                );

                return resolve(response);
            } catch(error) {
                return reject(error);
            }
        })
    }

    /**
      * Push notifications data pushed to the particular logged in user.
      * @method
      * @name pushNotificationMessageToDevice
      * @param {String} userId - Logged in user id.
      * @param {Object} notificationMessage - 
      * @param {String} notificationMessage.title - title of notification.
      * @param {String} notificationMessage.text - text of notification.
      * @param {String} notificationMessage.id - id of notification.
      * @param {String} notificationMessage.is_read - is_read property of notification.
      * @param {Object} notificationMessage.payload - payload of notification. 
      * @param {String} notificationMessage.action - action of notification.
      * @param {String} notificationMessage.internal - internal of notification.
      * @param {String} notificationMessage.created_at - created_at date of notification.
      * @param {String} notificationMessage.type - type date of notification.         
      * @returns {Promise} returns a promise.
     */

    static pushNotificationMessageToDevice(userId, notificationMessage) {
        return new Promise(async (resolve, reject) => {
            try {

                let getAllDevices = 
                await userExtensionHelper.userExtensionDocument({
                    userId: userId,
                    status: "active",
                    devices: {$exists : true},
                    isDeleted: false
                }, { devices: 1 });

                if (!getAllDevices.devices.length > 0) {
                    throw "No devices found";
                }

                let activeDevices = 
                getAllDevices.devices.filter(eachDeviceName => eachDeviceName.appType === notificationMessage.appType
                    && eachDeviceName.status === "active"
                );

                if( activeDevices.length > 0 ) {
                
                    for (let pointerToDevices = 0; 
                        pointerToDevices < activeDevices.length; 
                        pointerToDevices++
                        ) {
                            
                            let notificationDataToBeSent = {
                                deviceId: activeDevices[pointerToDevices].deviceId,
                                title: notificationMessage.title,
                                data: {
                                    "title": notificationMessage.title,
                                    "text": notificationMessage.text,
                                    id: "0",
                                    is_read: JSON.stringify(notificationMessage.is_read),
                                    payload: JSON.stringify(notificationMessage.payload),
                                    action: notificationMessage.action,
                                    internal: JSON.stringify(notificationMessage.internal),
                                    created_at: notificationMessage.created_at,
                                    type: notificationMessage.type
                                },
                                text: notificationMessage.text
                            };

                            await this.sendNotifications(
                                notificationDataToBeSent,
                                activeDevices,
                                userId,
                                activeDevices[pointerToDevices].os
                            );
                    }
                }

                return resolve();

            } catch (error) {
                return reject(error);
            }
        })
    }

};


    /**
      * Create notification in android.
      * @method
      * @name createNotificationInAndroid
      * @param {Object} notificationData - Notification that need to a given android.
      * @param {String} notificationData.data - Consists of Notification data.
      * @param {String} notificationData.title - title of notification.
      * @param {String} notificationData.text - text of notification. 
      * @param {String} notificationData.deviceId - where to sent the notifications.                                           
      * @returns {Promise} returns a promise.
     */

    async function _createNotificationInAndroidOrIos(
        notificationData,
        devices = [], 
        userId = ""
    ) {
        return new Promise(async (resolve, reject) => {
            try {

                let pushNotificationRelatedInformation = {
                    notification : {
                        title : notificationData.title,
                        body : notificationData.text ? 
                        notificationData.text : notificationData.message
                    },
                    data: notificationData.data ? notificationData.data : {},
                    android: {
                        ttl: 3600 * 1000, // 1 hour in milliseconds
                        priority: 'high',
                        notification: {
                            click_action : "FCM_PLUGIN_ACTIVITY",
                            icon : 'notifications_icon',
                            color: "#A63936"                        
                        },

                    },
                    apns: {},
                    token: notificationData.deviceId
                };

                let pushToDevice = 
                await _sendMessage(pushNotificationRelatedInformation);

                if ( !pushToDevice.success && devices.length > 0 && userId !== "" ) { 

                    await userExtensionHelper.updateDeviceStatus(
                        notificationData.deviceId, 
                        devices, 
                        userId
                    );
                }

                return resolve(pushToDevice);

            } catch (error) {
                return reject(error);
            }
        })
    }


    /**
      * FCM send message functionality.
      * @method
      * @name sendMessage
      * @param {Object} notificationInformation - Notification information.                                      
      * @returns {Promise} returns a promise.
     */

    async function _sendMessage(notificationInformation) {

        return new Promise(async (resolve, reject) => {
            try {

                let deviceId = notificationInformation.token;

                FCM.send(notificationInformation, (err, response) => {

                    let success;
                    let message = "";
                    if (err) {
                        if (err.errorInfo && err.errorInfo.message) {
                            if (err.errorInfo.message === "The registration token is not a valid FCM registration token") {

                                slackClient.sendMessageToSlack({
                                    "code" : err.errorInfo.code,
                                    "message" : err.errorInfo.message,
                                    slackErrorName: 
                                    gen.utils.checkIfEnvDataExistsOrNot("SLACK_ERROR_NAME"),
                                    color: 
                                    gen.utils.checkIfEnvDataExistsOrNot("SLACK_ERROR_MESSAGE_COLOR")
                                });

                                message = err.errorInfo.message;
                            }
                        }

                        success = false;

                    } else {
                        success = true;
                    }

                    return resolve({
                        success: success,
                        message: message
                    });
                });

            } catch (error) {
                return reject(error);
            }
        })

    }