const path = require("path");
const fs = require("fs-extra");
const winston = require("winston");

module.exports = {
  klassiLog() {
    const MyDate = new Date();
    let date;

    MyDate.setDate(MyDate.getDate());
    // eslint-disable-next-line prefer-const,no-useless-concat
    date = `${`${"-" + "0"}${MyDate.getDate()}`.slice(-2)}-${`0${
      MyDate.getMonth() + 1
    }`.slice(-2)}-${MyDate.getFullYear()}`;
    const infoJsonFile = path
      .join(`./log/infoLog/${reportName}-${date}.json`)
      .replace(/ /gi, "");
    const errorJsonFile = path
      .join(`./log/errorLog/${reportName}-${date}.json`)
      .replace(/ /gi, "");

    fs.ensureFile(infoJsonFile, (err) => {
      if (err) {
        log.error(`The infoLog File has NOT been created: ${err.stack}`);
      }
    });

    fs.ensureFile(errorJsonFile, (err) => {
      if (err) {
        log.error(`The errorLog File has NOT been created: ${err.stack}`);
      }
    });

    /**
     * Log files are raised and sent to the relevant files
     */
    const logger = winston.createLogger({
      level: "info",
      format: winston.format.json(),
      defaultMeta: { service: "user-service" },
      transports: [
        // new winston.transports.Console({}),
        new winston.transports.File({
          name: "info-file",
          filename: infoJsonFile,
          level: "info",
        }),
        new winston.transports.File({
          name: "error-file",
          filename: errorJsonFile,
          level: "error",
        }),
      ],
    });
    if (process.env.NODE_ENV !== "prod") {
      logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        })
      );
    }
    return logger;
  },
};
