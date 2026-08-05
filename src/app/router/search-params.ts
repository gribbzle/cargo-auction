import { z } from 'zod/v4';

export const auctionListSearchSchema = z.object({
  cargo_num: z.string().optional(),
  auc_type: z.array(z.string()).optional(),
  status: z.array(z.string()).optional(),
  load_city: z.string().optional(),
  unload_city: z.string().optional(),
  load_date_from: z.string().optional(),
  load_date_to: z.string().optional(),
  is_available: z.boolean().optional(),
  is_bidder: z.boolean().optional(),
  price_from: z.number().optional(),
  price_to: z.number().optional(),
  per_page: z.number().optional(),
  page: z.number().optional(),
});

export type AuctionListSearch = z.infer<typeof auctionListSearchSchema>;
