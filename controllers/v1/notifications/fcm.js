/**
 * name : fcm.js
 * author : Aman Jung Karki
 * created-date : 26-Nov-2019
 * Description :  Push notifications using firebase admin.
 */

const csv = require('csvtojson');
const userExtensionHelper = require(ROOT_PATH + "/module/user-extension/helper");
const FileStream = require(ROOT_PATH + "/generics/file-stream");
const firebaseHelpers = require(ROOT_PATH + "/generics/helpers/fcm");
const fcmHelpers = require(ROOT_PATH + "/module/notifications/fcm/helper")

module.exports = class Fcm {

    /**
     * @apiDefine errorBody
     * @apiError {String} status 4XX,5XX
     * @apiError {String} message Error
     */

    /**
     * @apiDefine successBody
     * @apiSuccess {String} status 200
     * @apiSuccess {String} result Data
     */

    constructor() {
    }

    static get name() {
        return "fcm";
    }

    /**
     * @api {post} /kendra/api/v1/notifications/fcm/registerDevice  Push Notifications To Users
     * @apiVersion 1.0.0
     * @apiName Push Notifications To Users
     * @apiGroup Notifications
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiParam {File} userData Mandatory userData file of type CSV.
     * @apiSampleRequest /kendra/api/v1/notifications/fcm/registerDevice
     * @apiUse successBody
     * @apiUse errorBody
     */

    async registerDevice(req) {
        return new Promise(async (resolve, reject) => {

            try {

                let deviceData = {
                    deviceId: req.body.deviceId,
                    app: req.headers.app,
                    os: req.headers.os,
                    status: "active",
                    activatedAt: new Date()
                }

                let result = await userExtensionHelper.createOrUpdate(deviceData, _.pick(req.userDetails, ["userId", "email", "userName"]));

                let response = {};

                if (result && result.success) {

                    response["result"] = {}

                    let topicArray = ["allUsers", "all-" + deviceData.app + "-users", "all-" + deviceData.app + "-" + deviceData.os + "-users"];

                    await Promise.all(topicArray.map(async topicName => {

                        let subscribeResult = await firebaseHelpers.subscribeDeviceToTopic(deviceData.deviceId, topicName)

                        response["result"][topicName] = subscribeResult.success ? "Subscribed" : "Could not subscribee"

                    }))
                } else {
                    response["status"] = httpStatusCode.ok.status
                }

                return resolve(response);

            } catch (error) {

                return reject({
                    status: error.status || httpStatusCode["internal_server_error"].status,
                    message: error.message || httpStatusCode["internal_server_error"].message,
                    errorObject: error
                })

            }
        })

    }

    /**
     * @api {post} /kendra/api/v1/notifications/fcn/pushToUsers  Push Notifications To Users
     * @apiVersion 1.0.0
     * @apiName Push Notifications To Users
     * @apiGroup Notifications
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiParam {File} userData Mandatory userData file of type CSV.
     * @apiSampleRequest /kendra/api/v1/notifications/fcm/pushToUsers
     * @apiUse successBody
     * @apiUse errorBody
     */

    async pushToUsers(req) {

        return new Promise(async (resolve, reject) => {

            try {

                if (!req.files || !req.files.userData) {
                    throw { message: "Missing file of type userData" }
                }

                let userData = await csv().fromString(req.files.userData.data.toString());

                const fileName = `push-to-device`;
                let fileStream = new FileStream(fileName);
                let input = fileStream.initStream();

                (async function () {
                    await fileStream.getProcessorPromise();
                    return resolve({
                        isResponseAStream: true,
                        fileNameWithPath: fileStream.fileNameWithPath()
                    });
                })();

                await Promise.all(userData.map(async element => {

                    let userProfile = await userExtensionHelper.userExtensionDocument({
                        userId: element.userId,
                        status: "active",
                        isDeleted: false
                    }, {
                            devices: 1
                        })

                    if (userProfile && userProfile.devices.length > 0) {

                        let matchDeviceData = userProfile.devices.filter(eachUserDevice => {
                            if (eachUserDevice.app == element.appName && eachUserDevice.status !== "inactive") {
                                return eachUserDevice
                            }
                        })

                        if (matchDeviceData.length > 0) {

                            await Promise.all(matchDeviceData.map(async device => {

                                if (element.message && element.title) {

                                    device.message = element.message;
                                    device.title = element.title;

                                    let notificationResult = await fcmHelpers.createNotificationInAndroid(device);

                                    if (!notificationResult.success) {

                                        await userExtensionHelper.updateDeviceStatus(device, userProfile.devices, element.userId)

                                        let topicArray = ["allUsers", "all-" + device.app + "-users", "all-" + device.app + "-" + device.os + "-users"];

                                        await Promise.all(topicArray.map(async topicName => {

                                            await firebaseHelpers.unsubscribeDeviceFromTopic(device.deviceId, topicName)
                                        }))

                                        element.status = "Fail"

                                    } else {

                                        element.status = "Success"
                                    }

                                } else {
                                    element.status = "Message or title is not present in csv"
                                }
                            }));

                        } else {
                            element.status = "Device is not there for particular app."
                        }

                    } else {
                        element.status = "No devices found."
                    }


                    input.push(element)

                }))

                input.push(null)

            } catch (error) {

                return reject({
                    status: error.status || httpStatusCode["internal_server_error"].status,
                    message: error.message || httpStatusCode["internal_server_error"].message,
                    errorObject: error
                })

            }
        })

    }


    /**
    * @api {post} /kendra/api/v1/notifications/fcm/pushToTopic Push Notification to topic
    * @apiVersion 1.0.0
    * @apiName Push Notification to topic
    * @apiGroup Notifications
    * @apiSampleRequest /kendra/api/v1/notifications/fcm/pushToTopic
    * @apiParam {File} pushToTopic Mandatory pushToTopic file of type CSV.    
    * @apiUse successBody
    * @apiUse errorBody
    */

    async pushToTopic(req) {
        return new Promise(async (resolve, reject) => {

            try {

                if (!req.files || !req.files.pushToTopic) {
                    throw { message: "Missing file of type pushToTopic" }
                }

                let topicData = await csv().fromString(req.files.pushToTopic.data.toString());

                const fileName = `push-to-topic`;
                let fileStream = new FileStream(fileName);
                let input = fileStream.initStream();

                (async function () {
                    await fileStream.getProcessorPromise();
                    return resolve({
                        isResponseAStream: true,
                        fileNameWithPath: fileStream.fileNameWithPath()
                    });
                })();

                await Promise.all(topicData.map(async singleTopicData => {

                    let topicCsvData = await fcmHelpers.pushData(singleTopicData)

                    input.push(topicCsvData)

                }))

                input.push(null)

            } catch (error) {

                return reject({
                    status: error.status || httpStatusCode["internal_server_error"].status,
                    message: error.message || httpStatusCode["internal_server_error"].message,
                    errorObject: error
                })

            }
        })

    }


    /**
    * @api {post} /kendra/api/v1/notifications/fcm/pushToAllUsers  Push Notification To ALL Users
    * @apiVersion 1.0.0
    * @apiName Push Notification To ALL Users Topic
    * @apiGroup Notifications
    * @apiSampleRequest /kendra/api/v1/notifications/fcm/pushToAllUsers
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiParam {File} pushToAllUsers Mandatory pushToAllUsers file of type CSV.        
    * @apiUse successBody
    * @apiUse errorBody
    */

    async pushToAllUsers(req) {
        return new Promise(async (resolve, reject) => {

            try {

                if (!req.files || !req.files.pushToAllUsers) {
                    throw { message: "Missing file of type pushToAllUsers" }
                }

                let pushToAllUsers = await csv().fromString(req.files.pushToAllUsers.data.toString());

                const fileName = `push-to-all-users`;
                let fileStream = new FileStream(fileName);
                let input = fileStream.initStream();

                (async function () {
                    await fileStream.getProcessorPromise();
                    return resolve({
                        isResponseAStream: true,
                        fileNameWithPath: fileStream.fileNameWithPath()
                    });
                })();


                await Promise.all(pushToAllUsers.map(async allUserData => {

                    let topicPushStatus = await fcmHelpers.pushData(allUserData)

                    input.push(topicPushStatus)

                }))

                input.push(null)

            } catch (error) {

                return reject({
                    status: error.status || httpStatusCode["internal_server_error"].status,
                    message: error.message || httpStatusCode["internal_server_error"].message,
                    errorObject: error
                })

            }
        })

    }


    /**
    * @api {post} /kendra/api/v1/notifications/fcm/subscribeToTopic  Subscribe To Topic
    * @apiVersion 1.0.0
    * @apiName Subscribe To Topic
    * @apiGroup Notifications
    * @apiSampleRequest /kendra/api/v1/notifications/fcm/subscribeToTopic
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiParam {File} subscribeToTopic Mandatory subscribeToTopic file of type CSV.            
    * @apiUse successBody
    * @apiUse errorBody
    */

    async subscribeToTopic(req) {
        return new Promise(async (resolve, reject) => {

            try {

                if (!req.files || !req.files.subscribeToTopic) {
                    throw { message: "Missing file of type subscribeToTopic" }
                }

                let subscribersData = await csv().fromString(req.files.subscribeToTopic.data.toString());

                const fileName = `subscribe-to-topic`;
                let fileStream = new FileStream(fileName);
                let input = fileStream.initStream();

                (async function () {
                    await fileStream.getProcessorPromise();
                    return resolve({
                        isResponseAStream: true,
                        fileNameWithPath: fileStream.fileNameWithPath()
                    });
                })();

                await Promise.all(subscribersData.map(async subscriber => {

                    let subscribeStatus = await fcmHelpers.subscribeOrUnSubscribeData(subscriber, true)

                    input.push(subscribeStatus)
                }))

                input.push(null)

            } catch (error) {

                return reject({
                    status: error.status || httpStatusCode["internal_server_error"].status,
                    message: error.message || httpStatusCode["internal_server_error"].message,
                    errorObject: error
                })

            }
        })

    }

    /**
    * @api {post} /kendra/api/v1/notifications/fcm/unsubscribeFromTopic  Unsubscribe From Topic
    * @apiVersion 1.0.0
    * @apiName Unsubscribe From Topic
    * @apiGroup Notifications
    * @apiSampleRequest /kendra/api/v1/notifications/fcm/unsubscribeFromTopic
    * @apiHeader {String} X-authenticated-user-token Authenticity token
    * @apiParam {File} unsubscribeFromTopic Mandatory unsubscribeFromTopic file of type CSV.                
    * @apiUse successBody
    * @apiUse errorBody
    */

    async unsubscribeFromTopic(req) {
        return new Promise(async (resolve, reject) => {

            try {

                if (!req.files || !req.files.unsubscribeFromTopic) {
                    throw { message: "Missing file of type unSubscribeFromTopic" }
                }

                let unsubscribersData = await csv().fromString(req.files.unsubscribeFromTopic.data.toString());

                const fileName = `unsubscribe-from-topic`;
                let fileStream = new FileStream(fileName);
                let input = fileStream.initStream();

                (async function () {
                    await fileStream.getProcessorPromise();
                    return resolve({
                        isResponseAStream: true,
                        fileNameWithPath: fileStream.fileNameWithPath()
                    });
                })();


                await Promise.all(unsubscribersData.map(async unsubscriber => {

                    let unSubscribeStatus = await fcmHelpers.subscribeOrUnSubscribeData(unsubscriber)

                    input.push(unSubscribeStatus)
                }))

                input.push(null)

            } catch (error) {

                return reject({
                    status: error.status || httpStatusCode["internal_server_error"].status,
                    message: error.message || httpStatusCode["internal_server_error"].message,
                    errorObject: error
                })

            }
        })

    }

};

