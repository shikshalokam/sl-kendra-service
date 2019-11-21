/**
 * name : smtp-config.js
 * author : Aman Jung Karki
 * created-date : 03-Dc-2019
 * Description : smtp server configuration.
 */


/**
 * Module dependencies.
 */

let nodemailer = require("nodemailer");


/**
 * Create an smtp connection.
 *
 * @return {smtpTransporter}
 */

var smtpConnection = async function (config) {

    let configurationOptions = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        // host: config.host,
        // port: Number(config.port),
        // secure: config.secure,
        auth: {
            user: config.user,
            pass: config.password
        }
    }

    let transporter = nodemailer.createTransport(configurationOptions);

    transporter.verify(function (error, success) {
        if (error) {
            debugLogger.error('SMTP Server not connected !!!!');
        } else {
            debugLogger.info('SMTP Server is connected!!!');

            if (success) {
                global.smtpServer = transporter;
            }
        }
    });

};


/**
 * Expose `smtpConnection`.
 */

module.exports = smtpConnection;
