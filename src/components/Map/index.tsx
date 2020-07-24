import React from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import { ICountryInfo } from "../../models/country-info";
import Circle from "./Circle";
import "./styles.css";

interface IMapsProps {
  casesType: string;
  countries: Array<ICountryInfo>;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

const Map: React.FC<IMapsProps> = ({
  casesType = "cases",
  countries,
  center,
  zoom,
}) => {
  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {countries.map((country) => (
          <Circle countryData={country} casesType={casesType} />
        ))}
      </LeafletMap>
    </div>
  );
};

export default Map;
