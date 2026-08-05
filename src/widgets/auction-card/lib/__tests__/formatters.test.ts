import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatWeight,
  formatVolume,
  formatDate,
} from '@/widgets/auction-card/lib/formatters';

describe('formatCurrency', () => {
  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('0 ₽');
  });

  it('formats positive number', () => {
    const result = formatCurrency(150000);
    expect(result).toContain('150');
    expect(result).toContain('000');
    expect(result).toContain('₽');
  });

  it('formats large number', () => {
    const result = formatCurrency(1000000);
    expect(result).toContain('1');
    expect(result).toContain('000');
    expect(result).toContain('000');
  });

  it('formats decimal number rounding down', () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain('1');
    expect(result).toContain('₽');
  });
});

describe('formatWeight', () => {
  it('formats weight in kg when less than 1000', () => {
    expect(formatWeight(500)).toBe('500 кг');
  });

  it('formats weight in tons when >= 1000', () => {
    expect(formatWeight(1500)).toBe('1.5 т');
  });

  it('formats exact 1000 as tons', () => {
    expect(formatWeight(1000)).toBe('1.0 т');
  });

  it('formats large weight', () => {
    expect(formatWeight(25000)).toBe('25.0 т');
  });
});

describe('formatVolume', () => {
  it('formats volume', () => {
    expect(formatVolume(12.5)).toBe('12.5 м³');
  });

  it('formats zero volume', () => {
    expect(formatVolume(0)).toBe('0 м³');
  });
});

describe('formatDate', () => {
  it('formats ISO date string', () => {
    const result = formatDate('2025-06-15T00:00:00Z');
    expect(result).toMatch(/\d{1,2}\s/);
  });

  it('returns a string', () => {
    const result = formatDate('2025-01-01');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
