/**
 * name : email/helper.js
 * author : Aman Jung Karki
 * created-date : 03-Dc-2019
 * Description : Email.
 */


/**
 * Load kafka Producer. 
 */

const kafkaCommunication = require(ROOT_PATH + "/generics/helpers/kafka-communications");
const nodemailerHelper = require(ROOT_PATH + "/generics/helpers/nodemailer")

module.exports = class notificationsHelper {


    /**
 * Send email to kafka producer. 
 */

    static send(emailData) {
        return new Promise(async (resolve, reject) => {
            try {

                await kafkaCommunication.pushEmailToKafka(emailData);
                // await nodemailerHelper.sendEmail(emailData);

                return resolve()


            } catch (error) {
                return reject(error);
            }
        })
    }

};