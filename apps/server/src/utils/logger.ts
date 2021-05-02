import winston from '../../config/winston';

// Add a custom function to display multiple args as a single message (useful during debug)
winston.debug = (...vars: unknown[]) => winston.info((vars as string[]).join(''));

export default winston;
