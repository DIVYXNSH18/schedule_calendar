declare module "city-timezones" {
  export interface CityEntry {
    city: string;
    city_ascii: string;
    lat: number;
    lng: number;
    pop: number;
    country: string;
    iso2: string;
    iso3: string;
    province: string;
    timezone: string;
  }
  export function lookupViaCity(city: string): CityEntry[];
  export function findFromCityStateProvince(query: string): CityEntry[];
  export const cityMapping: CityEntry[];
}
