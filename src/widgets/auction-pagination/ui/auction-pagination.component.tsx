import type { AuctionListMeta } from '@/shared/api/dto';
import { Button } from '@/shared/ui';

interface AuctionPaginationProps {
  meta: AuctionListMeta;
  onPageChange: (page: number) => void;
}

export function AuctionPagination({ meta, onPageChange }: AuctionPaginationProps) {
  const { current_page, last_page, total } = meta;

  if (last_page <= 1) return null;

  const pages: (number | '...')[] = [];
  for (let i = 1; i <= last_page; i++) {
    if (i === 1 || i === last_page || (i >= current_page - 1 && i <= current_page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 pt-4">
      <span className="text-sm text-gray-500">
        {meta.from}–{meta.to} из {total}
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={current_page <= 1}
          onClick={() => onPageChange(current_page - 1)}
        >
          ← Назад
        </Button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <Button
              key={p}
              variant={p === current_page ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          )
        )}
        <Button
          variant="ghost"
          size="sm"
          disabled={current_page >= last_page}
          onClick={() => onPageChange(current_page + 1)}
        >
          Далее →
        </Button>
      </div>
    </div>
  );
}
