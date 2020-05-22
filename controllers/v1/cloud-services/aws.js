/**
 * name : aws.js
 * author : Deepa
 * created-date : 01-Apr-2020
 * Description :  Aws service.
 */


// dependencies
let filesHelpers = require(ROOT_PATH+"/module/files/helper");

/**
    * Aws service.
    * @class
*/

module.exports = class Aws {

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

    constructor() { }

    static get name() {
        return "aws";
    }


    /**
     * @api {post} /kendra/api/v1/cloud-services/aws/getDownloadableUrl  
     * Get downloadable URL.
     * @apiVersion 1.0.0
     * @apiGroup Aws
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiParamExample {json} Request:
     * {
     * "filePaths": [],
     * "bucketName": ""
     * }
     * @apiSampleRequest /kendra/api/v1/cloud-services/aws/getDownloadableUrl
     * @apiUse successBody
     * @apiUse errorBody
     * @apiParamExample {json} Response:
     * {
     *  "status": 200,
     *  "message": "Url's generated successfully",
     *  "result": [{
     *  "filePath": "5e1c28a050452374e1cf9841/e97b5582-471c-4649-8401-3cc4249359bb/cdv_photo_117.jpg",
     *  "url": "https://storage.googleapis.com/download/storage/v1/b/sl-dev-storage/o/5e1c28a050452374e1cf9841%2Fe97b5582-471c-4649-8401-3cc4249359bb%2Fcdv_photo_117.jpg?generation=1579240054787924&alt=media"
     * }]
     */

    /**
      * Get Downloadable URL from aws.
      * @method
      * @name getDownloadableUrl
      * @param  {Request}  req  request body.
      * @returns {JSON} Response with status and message.
    */

    async getDownloadableUrl(req) {
        return new Promise(async (resolve, reject) => {

            try {

                console.log(" request ---", req.body.filePaths ,"--",
                req.body.bucketName)
                
                let downloadableUrl =
                await filesHelpers.getDownloadableUrl(
                     req.body.filePaths, 
                     req.body.bucketName,
                     constants.common.AWS_SERVICE
                );

                return resolve({
                    message: constants.apiResponses.CLOUD_SERVICE_SUCCESS_MESSAGE,
                    result: downloadableUrl
                })

            } catch (error) {

                return reject({
                    status:
                        error.status ||
                        httpStatusCode["internal_server_error"].status,

                    message:
                        error.message
                        || httpStatusCode["internal_server_error"].message,

                    errorObject: error
                })

            }
        })

    }


    /**
     * @api {post} /kendra/api/v1/cloud-services/aws/preSignedUrls  
     * Get signed URL.
     * @apiVersion 1.0.0
     * @apiGroup Aws
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiParamExample {json} Request:
     * {
     * "fileNames" : [
     * "N4X6E2/N4X6E2.png"
     * ],
     * "bucket":"sl-unnati-storage"
     * }
     * @apiSampleRequest /kendra/api/v1/cloud-services/aws/preSignedUrls
     * @apiUse successBody
     * @apiUse errorBody
     * @apiParamExample {json} Response:
     * {
     * "message": "Url generated successfully",
     * "status": 200,
     * "result": [
     * {
     * "file": "T9R6Y8/T9R6Y8.png",
     * "url": "https://sl-unnati-storage.s3.ap-south-1.amazonaws.com/qrcode/T9R6Y8/T9R6Y8.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJW4YWQMTNBKD2KTQ%2F20200421%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20200421T024629Z&X-Amz-Expires=1800&X-Amz-Signature=81d593329c96b318f2924b876854e534bf80aef1f10ca80083d74188b46e69de&X-Amz-SignedHeaders=host",
     * "payload": {
     * "sourcePath": "T9R6Y8/T9R6Y8.png"
     * },
     * "cloudStorage": "AWS"
     * }
     * ]
     * }
     */

    /**
      * Get signed urls.
      * @method
      * @name preSignedUrls
      * @param  {Request}  req  request body.
      * @param  {Array}  req.body.fileNames - list of file names
      * @param  {String}  req.body.bucket - name of the bucket  
      * @returns {JSON} Response with status and message.
    */

   async preSignedUrls(req) {
    return new Promise(async (resolve, reject) => {

        try {

            let signedUrl =
            await filesHelpers.preSignedUrls(
                 req.body.fileNames,
                 req.body.bucket,
                 constants.common.AWS_SERVICE
            );

            return resolve(signedUrl);

        } catch (error) {
            
            return reject({
                status:
                    error.status ||
                    httpStatusCode["internal_server_error"].status,

                message:
                    error.message
                    || httpStatusCode["internal_server_error"].message,

                errorObject: error
            })

        }
    })
   }

        /**
     * @api {post} /kendra/api/v1/cloud-services/aws/uploadToPresignedUrl  
     * upload file to presignedUrl
     * @apiVersion 1.0.0
     * @apiGroup Aws
     * @apiHeader {String} X-authenticated-user-token Authenticity token
     * @apiParamExample {json} Request:
     * {
     * "presignedUrl" : "https://storage.googleapis.com/sl-dev-storage/qrcode/R2I3A5/R2I3A5.png?GoogleAccessId=sl-dev-storage%40shikshalokam.iam.gserviceaccount.com&Expires=1587437414&Signature=N7yg1ixFXPG14vOxw7zPxMSm98qDoeY7IYtB8iRnSQRYTNwWRfAT7MqvLT3HW9iXexABEhhWPEDhVQt0J42BzY1it3mFMV1C9xgCl8Q%2BhuMVY746GIdapGEJEhicMGIeEVRy%2FItfuNg9UxcZyk1M3TU%2FEabQLCjAgMthnUvQ8tCqiH%2B1t%2FcJDODAvLv96sQVbO%2Fg4aW%2Bz3GGmtx39Kq%2FRTWVgxLBWu5wPs5PuDq7Xg6HSiD9peQylb7wRStkkuRP%2FMyjIhOuQTtgzPdNFV26I5WZu2Eu2EM5Hx6vDAYjXTOHuOry8fX6od5gcHMSjo9J645nNcN8tb97BIuG%2BgKOcg%3D%3D"
     * "fileName":"filename.csv"
     * }
     * @apiSampleRequest /kendra/api/v1/cloud-services/aws/uploadToPresignedUrl
     * @apiUse successBody
     * @apiUse errorBody
     * @apiParamExample {json} Response:
     * {
     * "message": "File Uploaded successfully",
     * "status": 200,
     * }
     */

    /**
      * To upload file cloud 
      * @method
      * @name upload
      * @param  {Request}  req  request body.
      * @param  {files}  req.files.file -actual file to upload
      * @param  {String}  req.body.presignedUrl -cloud url to upload
      * @param  {String}  req.body.fileName - name of file
      * @returns {JSON} Response with status and message.
    */
   async uploadToPresignedUrl(req) {
    return new Promise(async (resolve, reject) => {

        try {

            if(req.files && req.body.presignedUrl && req.body.fileName){

            let response  = await filesHelpers.uploadToPresignedUrl(
                req.body.presignedUrl,
                req.files.file,
                req.body.fileName,
           );
            return resolve(response);

            }else{
                return reject({
                    status:
                        httpStatusCode["bad_request"].status,
                    message:httpStatusCode["bad_request"].message

                });
            }
            

        } catch (error) {
            
            console.log(error);
            return reject({
                status:
                    error.status ||
                    httpStatusCode["internal_server_error"].status,

                message:
                    error.message
                    || httpStatusCode["internal_server_error"].message,

                errorObject: error
            })

        }
    })
   }


};

