interface ICountryInner {
  lat: number;
  long: number;
  iso3: string;
  flag: string;
}

export interface ICountryInfo {
  country: string;
  active: number;
  todayCases: number;
  cases: number;
  todayRecovered: number;
  recovered: number;
  todayDeaths: number;
  deaths: number;
  countryInfo: ICountryInner;
}