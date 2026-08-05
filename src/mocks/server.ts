import { setupServer } from 'msw/node';
import { handlers } from './handlers/auctions.handlers';

export const server = setupServer(...handlers);
