import winston, { Logger } from 'winston';

declare global {
  var logger: Logger | undefined;
}

export const logger =
  global.logger ||
  winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.prettyPrint(),
      winston.format.json()
    ),
    transports: [new winston.transports.Console()],
  });

if (process.env.NODE_ENV !== 'production') {
  global.logger = logger;
}
