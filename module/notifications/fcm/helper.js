let samikshaThemeColor = process.env.SAMIKSHA_THEME_COLOR ? process.env.SAMIKSHA_THEME_COLOR : "#A63936"
const userExtensionHelper = require(ROOT_PATH + "/module/user-extension/helper");
const firebaseHelpers = require(ROOT_PATH + "/generics/helpers/fcm");

module.exports = class pushNotificationsHelper {

    static pushToTopic(element) {
        return new Promise(async (resolve, reject) => {
            try {

                let pushNotificationRelatedInformation = {
                    topic: element.topicName,
                    notification: {
                        title: element.title,
                        body: element.message
                    }
                }

                let pushToTopicData = await firebaseHelpers.sendToTopic(pushNotificationRelatedInformation.topic, pushNotificationRelatedInformation.notification)

                return resolve(pushToTopicData)

            } catch (error) {
                return reject(error);
            }
        })
    }

    static createNotificationInAndroid(notificationData) {
        return new Promise(async (resolve, reject) => {
            try {

                let pushNotificationRelatedInformation = {
                    android: {
                        "data": notificationData.data ? notificationData.data : {},
                        ttl: 3600 * 1000, // 1 hour in milliseconds
                        priority: 'high',
                        notification: {
                            "click_action": "FCM_PLUGIN_ACTIVITY",
                            title: notificationData.title,
                            body: notificationData.text ? notificationData.text : notificationData.message,
                            icon: 'stock_ticker_update',
                            color: samikshaThemeColor
                        },

                    },
                    token: notificationData.deviceId
                }

                let pushToDevice = await firebaseHelpers.sendToDevice(notificationData.deviceId, pushNotificationRelatedInformation.android);

                return resolve(pushToDevice)

            } catch (error) {
                return reject(error);
            }
        })
    }

    static createNotificationInIos(notificationData) {
        return new Promise(async (resolve, reject) => {
            try {

                let pushNotificationRelatedInformation = {
                    android: {
                        notification: {
                            "click_action": "FCM_PLUGIN_ACTIVITY",
                            title: notificationData.title,
                            body: notificationData.text ? notificationData.text : notificationData.message,
                            icon: 'stock_ticker_update',
                            color: '#f45342'
                        }
                    },
                    token: notificationData.deviceId
                }

                let pushToDevice = await this.sendMessage(pushNotificationRelatedInformation)

                return resolve(pushToDevice)


            } catch (error) {
                return reject(error);
            }
        })
    }

    static pushData(allUserData) {
        return new Promise(async (resolve, reject) => {
            try {

                if (!allUserData.topicName) {
                    allUserData.topicName = "allUsers"
                }

                if (allUserData.message && allUserData.title) {
                    let topicResult = await this.pushToTopic(allUserData);

                    if (topicResult !== undefined && topicResult.success) {

                        allUserData.status = "success"

                    } else {
                        allUserData.status = "Fail"
                    }
                }
                else {
                    allUserData.status = "Message or title is not present in csv."
                }


                return resolve(allUserData)

            } catch (error) {
                return reject(error);
            }
        })
    }

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
                    deviceStatus = "active"
                } else {
                    deviceStatus = "inactive"
                }


                let subscribedOrUnSubscribed = [];

                if (userProfile && userProfile.devices.length > 0) {

                    let matchedDevices = userProfile.devices.filter(eachUserDevice => {
                        if (eachUserDevice.app == subscribeOrUnSubscribeData.appName && eachUserDevice.os == subscribeOrUnSubscribeData.os && eachUserDevice.status === deviceStatus) {
                            return eachUserDevice
                        }
                    })

                    if (matchedDevices.length > 0) {

                        await Promise.all(userProfile.devices.map(async device => {

                            device.topic = subscribeOrUnSubscribeData.topicName;

                            let result;

                            if (subscribeToTopic) {
                                result = await firebaseHelpers.subscribeDeviceToTopic(device.deviceId, device.topic)
                            } else {
                                result = await firebaseHelpers.unsubscribeDeviceFromTopic(device.deviceId, device.topic)
                            }

                            if (result !== undefined && result.success) {
                                subscribeOrUnSubscribeData.status = subscribeToTopic ? "successfully subscribed" : "successfully unsubscribed"

                            } else {
                                subscribeOrUnSubscribeData.status = subscribeToTopic ? "Fail to subscribe" : "Fail to unsubscribe"
                            }


                            subscribedOrUnSubscribed.push(subscribeOrUnSubscribeData)
                        }))

                    } else {
                        subscribeOrUnSubscribeData.status = "App name could not be found or status is inactive"

                        subscribedOrUnSubscribed.push(subscribeOrUnSubscribeData)
                    }

                } else {
                    subscribeOrUnSubscribeData.status = "No devices found."

                    subscribedOrUnSubscribed.push(subscribeOrUnSubscribeData)
                }

                return resolve(subscribeOrUnSubscribeData)

            } catch (error) {
                return reject(error);
            }
        })
    }

};