import app from './app.js';
import connectDatabase from './config/database.js';
import logger from './utils/logger.js';
import config from './config/index.js';
import createUser from './controllers/user.js';

const PORT = config.port;

(async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      logger.info(`SMS API listeni ${PORT}`);
    });
    // await createUser();
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
})();

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled promise rejection');
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error({ err: error }, 'Uncaught exception');
  process.exit(1);
});
