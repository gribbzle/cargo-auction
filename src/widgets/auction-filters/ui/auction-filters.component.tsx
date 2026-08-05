import { useState } from 'react';
import { searchCities } from '@/entities/city';
import { Input, Select, Combobox, Button } from '@/shared/ui';
import {
  type AuctionFilters,
  DEFAULT_FILTERS,
  AUC_TYPE_OPTIONS,
  STATUS_OPTIONS,
  PER_PAGE_OPTIONS,
} from '../model/filters';

interface AuctionFiltersWidgetProps {
  filters: AuctionFilters;
  onFiltersChange: (filters: AuctionFilters) => void;
}

export function AuctionFiltersWidget({ filters, onFiltersChange }: AuctionFiltersWidgetProps) {
  const [localFilters, setLocalFilters] = useState<AuctionFilters>(filters);
  const [mobileOpen, setMobileOpen] = useState(false);

  function update(key: keyof AuctionFilters, value: unknown) {
    setLocalFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  }

  function handleApply() {
    onFiltersChange(localFilters);
  }

  function handleReset() {
    setLocalFilters(DEFAULT_FILTERS);
    onFiltersChange(DEFAULT_FILTERS);
  }

  function handleMultiSelect(key: 'auc_type' | 'status', value: string) {
    setLocalFilters((prev) => {
      const current = prev[key] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next.length > 0 ? next : undefined, page: 1 };
    });
  }

  const cityOptions = searchCities('').map((c) => ({
    value: c.name,
    label: c.name,
    description: c.region,
  }));

  const hasActiveFilters =
    localFilters.cargo_num ||
    localFilters.load_city ||
    localFilters.unload_city ||
    localFilters.auc_type?.length ||
    localFilters.status?.length ||
    localFilters.load_date_from ||
    localFilters.load_date_to ||
    localFilters.price_from ||
    localFilters.price_to ||
    localFilters.is_available ||
    localFilters.is_bidder;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="w-full flex items-center justify-between sm:hidden text-sm font-medium text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
        aria-expanded={mobileOpen}
        aria-controls="auction-filters-content"
      >
        <span className="flex items-center gap-2">
          Фильтры
          {hasActiveFilters && (
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-sky-600 text-white text-xs"
              aria-label="Активные фильтры"
            >
              {
                [
                  localFilters.cargo_num,
                  localFilters.load_city,
                  localFilters.unload_city,
                  localFilters.auc_type?.length,
                  localFilters.status?.length,
                  localFilters.load_date_from,
                  localFilters.load_date_to,
                  localFilters.price_from,
                  localFilters.price_to,
                  localFilters.is_available,
                  localFilters.is_bidder,
                ].filter(Boolean).length
              }
            </span>
          )}
        </span>
        <span
          className={`transition-transform ${mobileOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      <div
        id="auction-filters-content"
        className={`${mobileOpen ? 'block' : 'hidden'} sm:block mt-3`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* cargo_num */}
          <Input
            id="cargo-num"
            label="Номер заявки"
            placeholder="ЗАЯВ-0001"
            value={localFilters.cargo_num ?? ''}
            onChange={(e) => update('cargo_num', e.target.value || undefined)}
          />

          {/* load city */}
          <Combobox
            id="load-city"
            label="Город погрузки"
            options={cityOptions}
            value={localFilters.load_city ?? ''}
            onChange={(val) => update('load_city', val || undefined)}
            placeholder="Выберите город..."
          />

          {/* unload city */}
          <Combobox
            id="unload-city"
            label="Город выгрузки"
            options={cityOptions}
            value={localFilters.unload_city ?? ''}
            onChange={(val) => update('unload_city', val || undefined)}
            placeholder="Выберите город..."
          />

          {/* per_page */}
          <Select
            id="per-page"
            label="На странице"
            options={PER_PAGE_OPTIONS}
            value={String(localFilters.per_page ?? 20)}
            onChange={(e) => update('per_page', Number(e.target.value))}
          />
        </div>

        {/* Multi-select: auc_type */}
        <div className="mt-4">
          <span className="text-sm font-medium text-gray-700 block mb-2">Тип аукциона</span>
          <div className="flex flex-wrap gap-2">
            {AUC_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleMultiSelect('auc_type', opt.value)}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  localFilters.auc_type?.includes(opt.value)
                    ? 'bg-sky-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-select: status */}
        <div className="mt-4">
          <span className="text-sm font-medium text-gray-700 block mb-2">Статус аукциона</span>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleMultiSelect('status', opt.value)}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  localFilters.status?.includes(opt.value)
                    ? 'bg-sky-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date range + Price range + Toggles */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            id="load-date-from"
            label="Дата погрузки от"
            type="date"
            value={localFilters.load_date_from ?? ''}
            onChange={(e) => update('load_date_from', e.target.value || undefined)}
          />
          <Input
            id="load-date-to"
            label="Дата погрузки до"
            type="date"
            value={localFilters.load_date_to ?? ''}
            onChange={(e) => update('load_date_to', e.target.value || undefined)}
          />
          <Input
            id="price-from"
            label="Цена от"
            type="number"
            placeholder="0"
            value={localFilters.price_from ?? ''}
            onChange={(e) =>
              update('price_from', e.target.value ? Number(e.target.value) : undefined)
            }
          />
          <Input
            id="price-to"
            label="Цена до"
            type="number"
            placeholder="∞"
            value={localFilters.price_to ?? ''}
            onChange={(e) =>
              update('price_to', e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>

        {/* Toggles */}
        <div className="mt-4 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.is_available ?? false}
              onChange={(e) => update('is_available', e.target.checked || undefined)}
              className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
            />
            Только доступные
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.is_bidder ?? false}
              onChange={(e) => update('is_bidder', e.target.checked || undefined)}
              className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
            />
            Где я делал ставки
          </label>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Button onClick={handleApply}>Применить</Button>
          <Button variant="secondary" onClick={handleReset}>
            Сбросить
          </Button>
        </div>
      </div>
    </div>
  );
}
