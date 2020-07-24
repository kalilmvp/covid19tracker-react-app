import React from "react";

import "./styles.css";
import numeral from "numeral";
import { ICountryInfo } from "../../models/country-info";

interface ITableProps {
  countries: Array<ICountryInfo>;
}

const Table: React.FC<ITableProps> = ({ countries }) => {
  return (
    <div className="table">
      <table>
        <tbody>
          {countries.map(({ country, cases }) => (
            <tr key={country}>
              <td>{country}</td>
              <td>
                <strong>{numeral(cases).format("0,0")}</strong>{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
