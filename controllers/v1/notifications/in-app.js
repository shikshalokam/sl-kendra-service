/**
 * name : notifications.js
 * author : Aman Jung Karki
 * created-date : 06-Nov-2019
 * modified-date:25-Nov-2019
 * Description : Notification related information for samiksha service.
 */


/**
* load modules.
*/

const notificationsHelper = require(ROOT_PATH + "/module/notifications/in-app/helper");
const csv = require('csvtojson');

module.exports = class InApp {

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
        return "notifications";
    }

    /**
    * @api {get} /kendra/api/v1/notifications/in-app/list?page=:page&limit=:limit Notifications List
    * @apiVersion 1.0.0
    * @apiName Notifications List
    * @apiGroup Notifications
    * @apiSampleRequest /kendra/api/v1/notifications/in-app/list?page=1&limit=10
    * @apiHeader {String} X-authenticated-user-token Authenticity token  
    * @apiUse successBody
    * @apiUse errorBody
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> ade398aad48b6fec4ea1a08abde47018437cef4f
    * @apiParamExample {json} Response Body:
    * {
        "message": "अधिसूचना की सूची",
        "status": 200,
        "result": {
            "data": [
                {
                    "is_read": false,
                    "internal": true,
                    "action": "alertModal",
                    "appName": "samiksha",
                    "created_at": "2019-11-29T09:53:55.294Z",
                    "text": "A new version of this app is available.",
                    "title": "New update available !",
                    "type": "Information",
                    "payload": {
                        "appVersion": "2.2.5",
                        "updateType": "minor",
                        "type": "appUpdate",
                        "platform": "android"
                    },
                    "id": 0
                }
            ],
            "count": 1
        }
        }
    */

    /**
        * List all notifications data. 
        * Notifications data may consists of push notifications or in-app notifications.
        * Call notificationsHelper internally for listing the notifications
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
    */

    async list(req) {
        return new Promise(async (resolve, reject) => {

            try {

                let notificationDocument = await notificationsHelper.list((req.params._id && req.params._id != "") ? req.params._id : req.userDetails.id, req.pageSize, req.pageNo, (req.query.appName && req.query.appName != "") ? req.query.appName : "", req.headers)

                return resolve({
                    result: notificationDocument,
                    message: req.t('notificationList')
                })

            } catch (error) {
                return reject({
                    status: error.status || httpStatusCode["internal_server_error"].status,
                    message: error.message || httpStatusCode["internal_server_error"].message
                })
            }
        })
    }

    /**
    * @api {get} /kendra/api/v1/notifications/in-app/unReadCount Count of Unread Notifications
    * @apiVersion 1.0.0
    * @apiName Count of Unread Notifications
    * @apiGroup Notifications
    * @apiSampleRequest /kendra/api/v1/notifications/in-app/unReadCount
    * @apiHeader {String} X-authenticated-user-token Authenticity token  
    * @apiUse successBody
    * @apiUse errorBody
<<<<<<< HEAD
<<<<<<< HEAD
    * @apiParamExample {json} Response Body:
    * {
        "message": "Unread Notification",
        "status": 200,
        "result": {
        "count": 0,
        "data": []
        }
    }
    */


    /**
        * Get the count of all unRead notifications.
        * Response consists of count and data (which is an array) of app update.
        * Call notificationsHelper internally for counting unread notifications.
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
=======
>>>>>>> 3c64cb988648e1b78e7b0073174dbc39b2585717
    */

    async unReadCount(req) {
        return new Promise(async (resolve, reject) => {
            try {

                let unReadCountDocument = await notificationsHelper.unReadCount(req.userDetails.id, (req.query.appName && req.query.appName != "") ? req.query.appName : "", req.headers)

                return resolve({
                    message: req.t('unreadNotifocation'),
                    status: httpStatusCode.ok.status,
                    result: {
                        count: unReadCountDocument.count,
                        data: unReadCountDocument.data
                    }
                })

            } catch (error) {
                reject({
                    status: error.status || httpStatusCode["internal_server_error"].status,
                    message: error.message || httpStatusCode["internal_server_error"].message
                })
            }
        })
    }

    /**
     * @api {post} /kendra/api/v1/notifications/in-app/markAsRead/{{notificationId}} Mark a Notification Read
     * @apiVersion 1.0.0
     * @apiName Mark a Notification Read
     * @apiGroup Notifications
     * @apiSampleRequest /kendra/api/v1/notifications/in-app/markAsRead/1
     * @apiUse successBody
     * @apiUse errorBody
     */


    /**
       * mark is_read true to a particular notification. 
       * Call notificationsHelper internally for marking red.
    */


    async markAsRead(req) {
        return new Promise(async (resolve, reject) => {

            try {


                await notificationsHelper.markAsRead(req.userDetails.id, req.params._id, (req.query.appName && req.query.appName != "") ? req.query.appName : "")

                return resolve({
                    message: req.t('markItReadNotification'),
                    status: httpStatusCode.ok.status
                })
            } catch (error) {
                reject({
                    status: error.status || httpStatusCode["internal_server_error"].status,
                    message: error.message || httpStatusCode["internal_server_error"].message
                })
            }
        })

    }

    /**
     * @api {post} /kendra/api/v1/notifications/in-app/updateVersion Upload app version
     * @apiVersion 1.0.0
     * @apiName Upload app version
     * @apiGroup Notifications
     * @apiSampleRequest /kendra/api/v1/notifications/in-app/updateVersion
     * @apiParam {File} updateVersion Mandatory updateVersion file of type CSV.     
     * @apiUse successBody
     * @apiUse errorBody
     */


    /**
      * Update existing version to the new version provided. 
      * Csv of new version will be provided.
   */

    async updateVersion(req) {
        return new Promise(async (resolve, reject) => {

            try {

                if (!req.files || !req.files.updateVersion) {
                    throw { message: "Missing file of type updateVersion" }
                }

                let updateVersionData = await csv().fromString(req.files.updateVersion.data.toString());

                await notificationsHelper.updateAppVersion(updateVersionData)

                return resolve({
                    message: "Successfully Uploaded Version",
                    status: httpStatusCode.ok.status
                })
            } catch (error) {
                reject({
                    status: error.status || httpStatusCode["internal_server_error"].status,
                    message: error.message || httpStatusCode["internal_server_error"].message
                })
            }
        })

    }

    async deleteBasedOnIndex(req) {
        return new Promise(async (resolve, reject) => {

            try {

                await elasticsearch.client.indices.delete({
                    index: req.params._id
                })

                return resolve({
                    message: "Successfully deleted",
                    status: httpStatusCode.ok.status
                })
            } catch (error) {
                reject({
                    status: error.status || httpStatusCode["internal_server_error"].status,
                    message: error.message || httpStatusCode["internal_server_error"].message
                })
            }
        })

    }


};

