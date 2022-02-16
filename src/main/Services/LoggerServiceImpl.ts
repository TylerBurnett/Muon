import { singleton } from 'tsyringe';
import { createLogger, format, Logger, transports } from 'winston';
import LoggerService from './LoggerService';

@singleton()
export default class LoggerServiceImpl implements LoggerService {
  public logger: Logger;

  constructor() {
    this.logger = LoggerServiceImpl.buildLogger();
  }

  private static buildLogger() {
    const logger = createLogger({
      level: 'info',
      format: format.json(),
      defaultMeta: { service: 'user-service' },
      transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
      ],
    });

    // If we're not in production then log to the `console`
    if (process.env.NODE_ENV !== 'production') {
      logger.add(
        new transports.Console({
          format: format.simple(),
        })
      );
    }

    return logger;
  }
}
