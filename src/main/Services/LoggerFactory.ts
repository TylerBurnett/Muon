import { createLogger, transports, format } from 'winston';

const buildLogger = () => {
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
};

export default buildLogger;
