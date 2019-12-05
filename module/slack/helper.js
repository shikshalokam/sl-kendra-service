let slackClient = require(ROOT_PATH + "/generics/helpers/slack-communications");

module.exports = class slackHelper {

    static error(data) {
        return new Promise(async (resolve, reject) => {
            try {

                let slackErrorData = await slackClient.sendErrorMessageToSlack(data);

                return resolve(slackErrorData);

            } catch (error) {
                return reject(error);
            }
        })


    }

};




