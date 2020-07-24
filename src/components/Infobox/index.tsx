import React from "react";

import "./styles.css";
import { Card, CardContent, Typography } from "@material-ui/core";

interface IInfoBoxProps {
  title: string;
  cases: string;
  total: String;
  active: boolean;
  isRed?: boolean;
  onClick(e: any): void;
}

const Infobox: React.FC<IInfoBoxProps> = ({
  title,
  cases,
  total,
  active,
  isRed,
  onClick,
}) => {
  return (
    <Card
      className={`info ${active && "infobox--selected"} ${
        isRed && "infobox--red"
      }`}
      onClick={onClick}
    >
      <CardContent>
        {/** title */}
        <Typography className="info__title" color="textSecondary">
          {title}
        </Typography>
        {/** number of cases */}
        <h2 className={`info__cases ${!isRed && "info__cases--green"}`}>
          {cases}
        </h2>
        {/** total */}
        <Typography className="info__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Infobox;
