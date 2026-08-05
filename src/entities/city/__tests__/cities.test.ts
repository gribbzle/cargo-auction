import { describe, it, expect } from 'vitest';
import { searchCities, getCityByGcId, getCityByName, CITIES_MOCK } from '@/entities/city';

describe('searchCities', () => {
  it('returns all cities when query is empty', () => {
    expect(searchCities('')).toHaveLength(CITIES_MOCK.length);
  });

  it('returns all cities when query is whitespace', () => {
    expect(searchCities('   ')).toHaveLength(CITIES_MOCK.length);
  });

  it('filters by city name', () => {
    const results = searchCities('Москва');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0]!.name).toBe('Москва');
  });

  it('filters by region', () => {
    const results = searchCities('Татарстан');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((c) => c.name === 'Казань')).toBe(true);
  });

  it('is case-insensitive', () => {
    const lower = searchCities('москва');
    const upper = searchCities('МОСКВА');
    expect(lower.length).toBe(upper.length);
  });

  it('returns empty for non-existent city', () => {
    const results = searchCities('ГородНеСуществует12345');
    expect(results).toHaveLength(0);
  });

  it('returns partial matches', () => {
    const results = searchCities('Петер');
    expect(results.some((c) => c.name === 'Санкт-Петербург')).toBe(true);
  });
});

describe('getCityByGcId', () => {
  it('returns city by gc_id', () => {
    const city = getCityByGcId(1);
    expect(city).toBeDefined();
    expect(city!.name).toBe('Москва');
  });

  it('returns undefined for non-existent gc_id', () => {
    expect(getCityByGcId(99999)).toBeUndefined();
  });
});

describe('getCityByName', () => {
  it('returns city by exact name', () => {
    const city = getCityByName('Казань');
    expect(city).toBeDefined();
    expect(city!.gc_id).toBe(3);
  });

  it('returns undefined for non-existent name', () => {
    expect(getCityByName('НесуществующийГород')).toBeUndefined();
  });
});
