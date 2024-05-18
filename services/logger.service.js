
const log4js = require("log4js");

// Logger
log4js.configure({
    appenders: { cms: { type: "file", filename: "cms-backend-api.log" } },
    categories: { default: { appenders: ["cms"], level: "info" } },
});

const logger = log4js.getLogger("cms");

exports.log = (message, type) => {
    switch (type) {
        case 'info':
            logger.info(message);
            break;
        case 'warn':
            logger.warn(message);
            break;
        case 'debug':
            logger.debug(message);
            break;
        default:
            logger.info(message);
            break;
    }
}