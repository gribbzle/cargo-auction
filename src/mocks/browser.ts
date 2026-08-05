import { setupWorker } from 'msw/browser';
import { handlers } from './handlers/auctions.handlers';

export const worker = setupWorker(...handlers);
