import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import Infobox from "./components/Infobox";
import "./App.css";
import api from "./services/api";
import Map from "./components/Map";
import Table from "./components/Table";
import { ICountryInfo } from "./models/country-info";
import { sortCases } from "./utils/sortCases";
import LineGraph from "./components/LineGraph";

import "leaflet/dist/leaflet.css";
import { printPrettyStat } from "./utils/printPrettyStat";

interface ICountryData {
  name: string;
  value: string;
}

function App() {
  const [countries, setCountries] = useState<ICountryData[]>([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({} as ICountryInfo);
  const [tableData, setTableData] = useState<ICountryInfo[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    async function loadCountries() {
      const response = await api.get<ICountryInfo[]>("countries");
      setCountries(
        response.data.map((country) => {
          return {
            name: country.country,
            value: country.countryInfo.iso3,
          };
        })
      );

      const sortedData = sortCases(response.data);

      setTableData(sortedData);
    }

    async function loadCountryInfo() {
      const response = await api.get("all");
      setCountryInfo(response.data);
    }

    loadCountries();
    loadCountryInfo();
  }, []);

  const handleCountryChanged = useCallback(
    async (e: ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
      const countryCode = e.target.value as string;

      const url =
        countryCode === "worldwide" ? "all" : `countries/${countryCode}`;
      const countriesData = await api.get(url);

      setCountry(countryCode);
      const countryInfo: ICountryInfo = countriesData.data;
      setCountryInfo(countryInfo);
      if (countryCode === "worldwide") {
        setMapCenter({ lat: 34.80746, lng: -40.4796 });
        setMapZoom(3);
      } else {
        setMapCenter({
          lat: countryInfo.countryInfo.lat,
          lng: countryInfo.countryInfo.long,
        });
        setMapZoom(4);
      }
    },
    []
  );

  return (
    <div className="app">
      <div className="app__left">
        {/** Header */}
        {/** Title + combobox  */}
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={handleCountryChanged}
            >
              <MenuItem value="worldwide" selected>
                Worldwide
              </MenuItem>
              {countries.map(
                (country) =>
                  country.value && (
                    <MenuItem key={country.value} value={country.value}>
                      {country.name}
                    </MenuItem>
                  )
              )}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          {/** Infobox title="Coronavirus Cases"*/}
          <Infobox
            isRed
            onClick={(e) => setCasesType("cases")}
            active={casesType === "cases"}
            title="Coronavirus Cases"
            cases={printPrettyStat(countryInfo.todayCases)}
            total={printPrettyStat(countryInfo.cases)}
          />
          {/** Infobox ... */}
          <Infobox
            onClick={(e) => setCasesType("recovered")}
            active={casesType === "recovered"}
            title="Recovered"
            cases={printPrettyStat(countryInfo.todayRecovered)}
            total={printPrettyStat(countryInfo.recovered)}
          />
          {/** Infobox ... */}
          <Infobox
            isRed
            onClick={(e) => setCasesType("deaths")}
            active={casesType === "deaths"}
            title="Deaths"
            cases={printPrettyStat(countryInfo.todayDeaths)}
            total={printPrettyStat(countryInfo.deaths)}
          />
        </div>
        {/** Map */}
        <Map
          casesType={casesType}
          countries={tableData}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          {/** Table */}
          <h3>Live cases by Country</h3>

          <Table countries={tableData} />

          {/** Graph */}
          <div className="app__graph">
            <h3>Worldwide new {casesType}</h3>
            <LineGraph
              casesType={casesType}
              isRed={casesType === "deaths" || casesType === "cases"}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
