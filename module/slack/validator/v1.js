module.exports = (req) => {

    let slackValidator = {

        error: function () {
            req.checkBody('slackErrorName').exists().withMessage("required error title for slack");
            req.checkBody('Environment').exists().withMessage("required node env");
            req.checkBody('Method').exists().withMessage("required method name");
            req.checkBody('Url').exists().withMessage("required Url");
            // req.checkBody('error').exists().withMessage("required error data");
        },

    }

    if (slackValidator[req.params.method]) slackValidator[req.params.method]();

};