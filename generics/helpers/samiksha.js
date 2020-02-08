/**
 * name : samiksha.js
 * author : Aman Jung Karki
 * Date : 11-Nov-2019
 * Description : All samiksha related api call.
 */

//dependencies

const request = require('request');
const slackClient = 
require(ROOT_PATH + "/generics/helpers/slack-communications");

/**
  * Samiksha api for getting all the pending assessments. 
  * Assessments whose status is pending.
  * @function
  * @name pendingAssessments
  * @returns {Promise} returns a promise.
*/

var pendingAssessments = function () {

    const samikshaServiceUrl = 
    process.env.APPLICATION_BASE_HOST + 
    process.env.SAMIKSHA_SERVICE_BASE_URL + 
    process.env.SAMIKSHA_PENDING_ASSESSMENTS;

    return new Promise((resolve, reject) => {
        try {

            const samikshaCallBack = function (err, response) {
                if (err) {

                    let errorObject = {
                        slackErrorName: process.env.SLACK_ERROR_NAME,
                        color: process.env.SLACK_ERROR_MESSAGE_COLOR,
                        message: `Samiksha service is down for address ${err.address}`
                    };

                    slackClient.sendMessageToSlack(errorObject);
                    logger.error("Failed to connect to samiksha service.");
                } else {
                    let pendingAssessments = JSON.parse(response.body);
                    return resolve(pendingAssessments);
                }
            }

            request.get(samikshaServiceUrl, {
                headers: {
                    "internal-access-token": process.env.INTERNAL_ACCESS_TOKEN
                }
            }, samikshaCallBack);

        } catch (error) {
            return reject(error);
        }
    })

}

/**
  * Samiksha api for getting all the pending observations. Observations whose status is pending.
  * @function
  * @name pendingObservations
  * @returns {Promise} returns a promise.
*/

var pendingObservations = function () {

    const samikshaServiceUrl = 
    process.env.APPLICATION_BASE_HOST + 
    process.env.SAMIKSHA_SERVICE_BASE_URL + 
    process.env.SAMIKSHA_PENDING_OBSERVATIONS;

    return new Promise((resolve, reject) => {
        try {
            const samikshaCallBack = function (err, response) {
                if (err) {
                    let errorObject = {
                        slackErrorName: process.env.SLACK_ERROR_NAME,
                        color: process.env.SLACK_ERROR_MESSAGE_COLOR,
                        message: `Samiksha service is down for address ${err.address}`
                    };

                    slackClient.sendMessageToSlack(errorObject);
                    logger.error("Failed to connect to samiksha service.");
                } else {
                    let pendingObservations = JSON.parse(response.body);
                    return resolve(pendingObservations);

                }
            }

            request.get(samikshaServiceUrl, {
                headers: {
                    "internal-access-token": process.env.INTERNAL_ACCESS_TOKEN
                }
            }, samikshaCallBack);
        } catch (error) {
            return reject(error);
        }
    })

}

/**
  * Samiksha api for getting all the completed assessments.Assessments whose status is completed.
  * @function
  * @name completedAssessments
  * @returns {Promise} returns a promise.
*/

var completedAssessments = function () {

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth()+1;
    let currentYear = currentDate.getFullYear();
    let lastDateOfMonth = new Date(currentYear,currentMonth,0).getDate();
    let fromDate = `01-${currentMonth}-${currentYear}`;
    let toDate = `${lastDateOfMonth}-${currentMonth}-${currentYear}`;

    const completedAssessmentsUrl = `${process.env.APPLICATION_BASE_HOST}${process.env.SAMIKSHA_SERVICE_BASE_URL}${process.env.SAMIKSHA_COMPLETED_ASSESSMENTS}?fromDate=${fromDate}&toDate=${toDate}`;
    
    return new Promise((resolve, reject) => {
        try {
            const samikshaCallBack = function (err, response) {
                if (err) {
                    let errorObject = {
                        slackErrorName: process.env.SLACK_ERROR_NAME,
                        color: process.env.SLACK_ERROR_MESSAGE_COLOR,
                        message: `Samiksha service is down for address ${err.address}`
                    };

                    slackClient.sendMessageToSlack(errorObject);
                    logger.error("Failed to connect to samiksha service.");

                } else {
                    let completedAssessments = JSON.parse(response.body);
                    return resolve(completedAssessments);
                }
            }

            request.get(completedAssessmentsUrl, {
                headers: {
                    "internal-access-token": process.env.INTERNAL_ACCESS_TOKEN
                }
            }, samikshaCallBack);
        } catch (error) {
            return reject(error);
        }
    })

}

/**
  * Samiksha api for getting all the completed observations.Observations whose status is completed.
  * @function
  * @name completedObservations
  * @returns {Promise} returns a promise.
*/

var completedObservations = function () {

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth()+1;
    let currentYear = currentDate.getFullYear();
    let lastDateOfMonth = new Date(currentYear,currentMonth,0).getDate();
    let fromDate = `01-${currentMonth}-${currentYear}`;
    let toDate = `${lastDateOfMonth}-${currentMonth}-${currentYear}`;

    const completedObservationsUrl = `${process.env.APPLICATION_BASE_HOST}${process.env.SAMIKSHA_SERVICE_BASE_URL}${process.env.SAMIKSHA_COMPLETED_OBSERVATIONS}?fromDate=${fromDate}&toDate=${toDate}`;

    return new Promise((resolve, reject) => {
        try {
            const samikshaCallBack = function (err, response) {

                if (err) {

                    let errorObject = {
                        slackErrorName: process.env.SLACK_ERROR_NAME,
                        color: process.env.SLACK_ERROR_MESSAGE_COLOR,
                        message: `Samiksha service is down for address ${err.address}`
                    };

                    slackClient.sendMessageToSlack(errorObject);
                    logger.error("Failed to connect to samiksha service.");

                } else {
                    let completedObservations = JSON.parse(response.body);
                    return resolve(completedObservations);

                }
            }

            request.get(completedObservationsUrl, {
                headers: {
                    "internal-access-token": process.env.INTERNAL_ACCESS_TOKEN
                }
            }, samikshaCallBack);
        } catch (error) {
            return reject(error);
        }
    })

}

module.exports = {
    pendingAssessments: pendingAssessments,
    completedAssessments: completedAssessments,
    pendingObservations: pendingObservations,
    completedObservations: completedObservations
};