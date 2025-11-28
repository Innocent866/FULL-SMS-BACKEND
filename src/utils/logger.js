import '../config/env.js';
import pino from 'pino';
import pretty from 'pino-pretty';

const stream = pretty({ colorize: true, translateTime: 'SYS:standard' });

const logger = pino({ level: process.env.LOG_LEVEL || 'info' }, stream);

export default logger;
