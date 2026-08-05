import { z } from 'zod/v4';

export const auctionFiltersSchema = z.object({
  cargo_num: z.string().optional(),
  auc_type: z.array(z.string()).optional(),
  status: z.array(z.string()).optional(),
  load_city: z.string().optional(),
  load_gc_id: z.number().optional(),
  unload_city: z.string().optional(),
  unload_gc_id: z.number().optional(),
  load_date_from: z.string().optional(),
  load_date_to: z.string().optional(),
  is_available: z.boolean().optional(),
  is_bidder: z.boolean().optional(),
  price_from: z.number().optional(),
  price_to: z.number().optional(),
  per_page: z.number().optional(),
  page: z.number().optional(),
});

export type AuctionFilters = z.infer<typeof auctionFiltersSchema>;

export const DEFAULT_FILTERS: AuctionFilters = {
  cargo_num: undefined,
  auc_type: undefined,
  status: undefined,
  load_city: undefined,
  load_gc_id: undefined,
  unload_city: undefined,
  unload_gc_id: undefined,
  load_date_from: undefined,
  load_date_to: undefined,
  is_available: undefined,
  is_bidder: undefined,
  price_from: undefined,
  price_to: undefined,
  per_page: 20,
  page: 1,
};

export const AUC_TYPE_OPTIONS = [
  { value: 'Request', label: 'Request' },
  { value: 'Up', label: 'Up' },
  { value: 'Down', label: 'Down' },
  { value: 'FixPrice', label: 'FixPrice' },
];

export const STATUS_OPTIONS = [
  { value: 'Planning', label: 'Planning' },
  { value: 'Auction', label: 'Auction' },
  { value: 'DeterminateWinner', label: 'DeterminateWinner' },
  { value: 'WaitDeal', label: 'WaitDeal' },
  { value: 'InProgress', label: 'InProgress' },
  { value: 'Finished', label: 'Finished' },
  { value: 'Stopped', label: 'Stopped' },
  { value: 'Canceled', label: 'Canceled' },
];

export const PER_PAGE_OPTIONS = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' },
];
