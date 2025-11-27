// src/components/TableDisplay.jsx
import React from "react";
import { Database } from "lucide-react";

const TableDisplay = ({ rows }) => {
  if (!rows || rows.length === 0) return null;

  return (
    <div className="card card-custom overflow-hidden">
      <div className="card-header bg-white border-bottom p-3 d-flex align-items-center gap-2">
        <Database className="text-primary" size={20} />
        <h5 className="mb-0 fw-bold">Raw Market Data</h5>
      </div>
      <div className="table-responsive" style={{ maxHeight: "350px" }}>
        <table className="table table-hover mb-0 align-middle">
          <thead className="table-light sticky-header">
            <tr>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3 text-end">Avg Price</th>
              <th className="px-4 py-3 text-end">Total Units</th>
              <th className="px-4 py-3 text-end text-success">Res. Sold</th>
              <th className="px-4 py-3 text-end">Office Sold</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="px-4 fw-bold text-dark">{row.year}</td>
                <td className="px-4">{row.area}</td>
                <td className="px-4 text-end text-secondary">
                  ₹{row.avgPrice.toLocaleString()}
                </td>
                <td className="px-4 text-end">
                  {row.totalUnits.toLocaleString()}
                </td>
                <td className="px-4 text-end fw-bold text-success">
                  {row.resSold.toLocaleString()}
                </td>
                <td className="px-4 text-end">
                  {row.officeSold.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableDisplay;
