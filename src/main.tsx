import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryProvider } from './app/providers/query-provider';
import { Router } from './app/router/router-provider';
import './index.css';

async function enableMocking() {
  if (import.meta.env.PROD) return;
  const { worker } = await import('./mocks/browser');
  const { auctionStore } = await import('./mocks/store/auctions.store');
  const { generateSeedData } = await import('./mocks/seed/auctions.seed');

  const seedData = generateSeedData();
  for (const seed of seedData) {
    auctionStore.auctions.set(seed.uuid, seed);
  }

  return worker.start({ onUnhandledRequest: 'bypass' });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryProvider>
        <Router />
      </QueryProvider>
    </StrictMode>
  );
});
