export interface City {
  id: number
  gc_id: number
  name: string
  region?: string
}

export const CITIES_MOCK: City[] = [
  { id: 1, gc_id: 1, name: 'Москва', region: 'Московская область' },
  { id: 2, gc_id: 2, name: 'Санкт-Петербург', region: 'Ленинградская область' },
  { id: 3, gc_id: 3, name: 'Казань', region: 'Республика Татарстан' },
  { id: 4, gc_id: 4, name: 'Екатеринбург', region: 'Свердловская область' },
  { id: 5, gc_id: 5, name: 'Новосибирск', region: 'Новосибирская область' },
  { id: 6, gc_id: 6, name: 'Челябинск', region: 'Челябинская область' },
  { id: 7, gc_id: 7, name: 'Самара', region: 'Самарская область' },
  { id: 8, gc_id: 8, name: 'Уфа', region: 'Республика Башкортостан' },
  { id: 9, gc_id: 9, name: 'Ростов-на-Дону', region: 'Ростовская область' },
  { id: 10, gc_id: 10, name: 'Волгоград', region: 'Волгоградская область' },
  { id: 11, gc_id: 11, name: 'Краснодар', region: 'Краснодарский край' },
  { id: 12, gc_id: 12, name: 'Омск', region: 'Омская область' },
  { id: 13, gc_id: 13, name: 'Тюмень', region: 'Тюменская область' },
  { id: 14, gc_id: 14, name: 'Нижний Новгород', region: 'Нижегородская область' },
  { id: 15, gc_id: 15, name: 'Красноярск', region: 'Красноярский край' },
  { id: 16, gc_id: 16, name: 'Саратов', region: 'Саратовская область' },
  { id: 17, gc_id: 17, name: 'Воронеж', region: 'Воронежская область' },
  { id: 18, gc_id: 18, name: 'Пермь', region: 'Пермский край' },
  { id: 19, gc_id: 19, name: 'Тольятти', region: 'Самарская область' },
  { id: 20, gc_id: 20, name: 'Ижевск', region: 'Удмуртская Республика' },
  { id: 21, gc_id: 21, name: 'Барнаул', region: 'Алтайский край' },
  { id: 22, gc_id: 22, name: 'Иркутск', region: 'Иркутская область' },
  { id: 23, gc_id: 23, name: 'Хабаровск', region: 'Хабаровский край' },
  { id: 24, gc_id: 24, name: 'Владивосток', region: 'Приморский край' },
  { id: 25, gc_id: 25, name: 'Махачкала', region: 'Республика Дагестан' },
  { id: 26, gc_id: 26, name: 'Томск', region: 'Томская область' },
  { id: 27, gc_id: 27, name: 'Оренбург', region: 'Оренбургская область' },
  { id: 28, gc_id: 28, name: 'Кемерово', region: 'Кемеровская область' },
  { id: 29, gc_id: 29, name: 'Новокузнецк', region: 'Кемеровская область' },
  { id: 30, gc_id: 30, name: 'Рязань', region: 'Рязанская область' },
  { id: 31, gc_id: 31, name: 'Астрахань', region: 'Астраханская область' },
  { id: 32, gc_id: 32, name: 'Пenza', region: 'Пензенская область' },
  { id: 33, gc_id: 33, name: 'Киров', region: 'Кировская область' },
  { id: 34, gc_id: 34, name: 'Тула', region: 'Тульская область' },
  { id: 35, gc_id: 35, name: 'Белгород', region: 'Белгородская область' },
  { id: 36, gc_id: 36, name: 'Курск', region: 'Курская область' },
  { id: 37, gc_id: 37, name: 'Калининград', region: 'Калининградская область' },
  { id: 38, gc_id: 38, name: 'Сочи', region: 'Краснодарский край' },
  { id: 39, gc_id: 39, name: 'Сургут', region: 'Ханты-Мансийский АО' },
  { id: 40, gc_id: 40, name: 'Севастополь', region: 'Город федерального значения' },
  { id: 41, gc_id: 41, name: 'Чебоксары', region: 'Чувашская Республика' },
  { id: 42, gc_id: 42, name: 'Брянск', region: 'Брянская область' },
  { id: 43, gc_id: 43, name: 'Магнитогорск', region: 'Челябинская область' },
  { id: 44, gc_id: 44, name: 'Калуга', region: 'Калужская область' },
  { id: 45, gc_id: 45, name: 'Иваново', region: 'Ивановская область' },
  { id: 46, gc_id: 46, name: 'Кострома', region: 'Костромская область' },
  { id: 47, gc_id: 47, name: 'Смоленск', region: 'Смоленская область' },
  { id: 48, gc_id: 48, name: 'Ярославль', region: 'Ярославская область' },
  { id: 49, gc_id: 49, name: 'Чита', region: 'Забайкальский край' },
  { id: 50, gc_id: 50, name: 'Ульяновск', region: 'Ульяновская область' },
]

export function searchCities(query: string): City[] {
  if (!query.trim()) return CITIES_MOCK
  const lower = query.toLowerCase()
  return CITIES_MOCK.filter(
    (city) =>
      city.name.toLowerCase().includes(lower) ||
      city.region?.toLowerCase().includes(lower),
  )
}

export function getCityByGcId(gcId: number): City | undefined {
  return CITIES_MOCK.find((city) => city.gc_id === gcId)
}

export function getCityByName(name: string): City | undefined {
  return CITIES_MOCK.find((city) => city.name === name)
}
