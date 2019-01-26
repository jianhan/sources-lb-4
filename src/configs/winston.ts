const appRoot = require('app-root-path');
const winston = require('winston');

// define the custom settings for each transport (file, console)
const env = process.env.NODE_ENV || 'development';
let options = {
  file: {
    level: env === 'development' ? 'debug' : 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 104857600, // 10MB
    maxFiles: 10,
    colorize: false,
  },
  console: {
    level: env === 'development' ? 'debug' : 'info',
    handleExceptions: true,
    prettyPrint: function(object: object) {
      return JSON.stringify(object);
    },
    json: false,
    colorize: true,
  },
};

// instantiate a new Winston Logger with the settings defined above
let logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: (message: string, encoding: string) => {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}

export default logger;
