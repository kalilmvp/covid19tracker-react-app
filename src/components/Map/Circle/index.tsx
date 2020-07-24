import React, { useCallback, useState } from "react";
import { Circle as CirleComp, Popup } from "react-leaflet";
import numeral from "numeral";

import "./styles.css";
import { ICountryInfo } from "../../../models/country-info";
import api from "../../../services/api";

const casesTypeStructure = {
  cases: {
    hex: "#CC1034",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 2000,
  },
};

interface ICircleProps {
  countryData: ICountryInfo;
  casesType: string;
}

const Circle: React.FC<ICircleProps> = ({ countryData, casesType }) => {
  const [country, setCountry] = useState<ICountryInfo>(countryData);

  const handleOpen = useCallback(async (countryCode: string) => {
    const countryInfoData = await api.get(`countries/${countryCode}`);
    console.log(countryInfoData);
    setCountry(countryInfoData.data);
  }, []);

  return (
    <CirleComp
      key={country.country}
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={casesTypeStructure[casesType].hex}
      fillColor={casesTypeStructure[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypeStructure[casesType].multiplier
      }
    >
      <Popup onOpen={() => handleOpen(country.countryInfo.iso3)}>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className="info-name">{country.country}</div>
          <div className="info-cases">
            Active cases: {numeral(country.active).format("0,0")}
          </div>
          <div className="info-cases">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </CirleComp>
  );
};

export default Circle;
