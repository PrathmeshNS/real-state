import React from "react";
import ChartDisplay from "./ChartDisplay";
import TableDisplay from "./TableDisplay";

const CompareAreaStrip = ({ areas }) => {
  if (!areas || areas.length === 0) return null;

  return (
    <div className="col-12">
      <div className="d-flex flex-row flex-nowrap gap-4 overflow-auto pb-3">
        {areas.map((area) => (
          <div
            key={area.name}
            className="flex-shrink-0"
            style={{
              width: "630px",
              flexBasis: "630px",
              maxWidth: "630px",
            }}
          >
            <h5 className="fw-bold mb-3">{area.name}</h5>
            <ChartDisplay data={area.chartData} />
            <div className="mt-3">
              <TableDisplay rows={area.rows} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompareAreaStrip;
