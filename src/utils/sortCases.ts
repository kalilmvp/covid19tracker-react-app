import { ICountryInfo } from "../models/country-info";

export const sortCases = (data: ICountryInfo[]) => {
  const sortedData = [...data];

  return sortedData.sort((a, b) => a.cases > b.cases ? -1 : 1);
}
