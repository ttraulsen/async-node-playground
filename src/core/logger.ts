import winston from 'winston';
import { version, name } from '../../package.json';
import { asyncLocalStorage } from '../middleware/addCorrelationId';

const enumerateErrorFormat = winston.format((info) => {
  if (info.err && info.err instanceof Error) {
    info = Object.assign(
      {
        message: `${info.message} - ${info.err.message}`,
        stack: info.err.stack,
      },
      info
    );
  }
  if (info.message.err && info.message.err instanceof Error) {
    info.message = Object.assign(
      {
        message: info.message.err.message,
        stack: info.message.err.stack,
      },
      info.message
    );
  }
  if (info.message instanceof Error) {
    info.message = Object.assign(
      {
        message: info.message.message,
        stack: info.message.stack,
      },
      info.message
    );
  }

  if (info instanceof Error) {
    return Object.assign(
      {
        message: info.message,
        stack: info.stack,
      },
      info
    );
  }

  // return Object.assign({ originalInfo: info }, info);
  return info;
});

const createLogger = (): winston.Logger => {
  const logLevel = process.env.LOG_LEVEL || 'info';
  const log = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
      enumerateErrorFormat(),
      winston.format.errors({ stack: true }),
      winston.format((info, _opts) => {
        const store = asyncLocalStorage.getStore();
        if (store) info.correlationId = store;
        return info;
      })(),
      winston.format.metadata(),
      winston.format.json()
    ),
    defaultMeta: { service: name, version: version },
    transports: [
      new winston.transports.Console({
        format: logFormat,
        level: logLevel,
      }),
    ],
  });
  return log;
};

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

export const logger = createLogger();
