// src/App.jsx
import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import api from "./api";
import Header from "./components/Header";
import ChatBox from "./components/ChatBox";
import Summary from "./components/Summary";
import ChartDisplay from "./components/ChartDisplay";
import TableDisplay from "./components/TableDisplay";
import LoadingState from "./components/LoadingState";
import DownloadBar from "./components/DownloadBar";
import CompareAreaStrip from "./components/CompareAreaStrip";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [chartData, setChartData] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [compareAreas, setCompareAreas] = useState(null); // [{name, chartData, rows}]

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      body { background-color: #f8f9fa; }
      .search-input { border-radius: 50px 0 0 50px; padding-left: 25px; border-right: none; }
      .search-btn { border-radius: 0 50px 50px 0; padding-right: 25px; padding-left: 20px; }
      .card-custom { border: none; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
      .summary-gradient { background: linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%); border-left: 5px solid #0d6efd; }
      .sticky-header th { position: sticky; top: 0; background-color: #f8f9fa; z-index: 10; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSearch = async (query) => {
    setLoading(true);
    setSummary("");
    setChartData([]);
    setTableRows([]);
    setMeta(null);
    setCompareAreas(null);

    try {
      const res = await api.post("/analyze/", { query });
      const data = res.data;

      const formattedChartData = data.chart.years.map((year, index) => ({
        year,
        price: data.chart.price[index],
        demand: data.chart.demand[index],
      }));

      const mappedTable = data.table.map((row) => ({
        year: row.year,
        area: row["final location"],
        avgPrice: row["flat - weighted average rate"],
        totalUnits: row["total units"],
        resSold: row["residential_sold - igr"] ?? row["flat_sold - igr"],
        officeSold: row["office_sold - igr"],
        shopSold: row["shop_sold - igr"],
      }));

      setSummary(data.summary);
      setMeta(data.meta);

      const areas = data.meta?.areas || [];

      if (areas.length > 1) {
        const perArea = areas.map((areaName) => {
          const areaRows = mappedTable.filter((r) => r.area === areaName);
          const sortedRows = [...areaRows].sort((a, b) => a.year - b.year);

          const areaChartData = sortedRows.map((r) => ({
            year: r.year,
            price: r.avgPrice,
            demand: r.totalUnits,
          }));

          return { name: areaName, chartData: areaChartData, rows: sortedRows };
        });

        setCompareAreas(perArea);
        setChartData([]);
        setTableRows([]);
      } else {
        setCompareAreas(null);
        setChartData(formattedChartData);
        setTableRows(mappedTable);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Error while fetching analysis. Check backend and try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasResults =
    summary ||
    chartData.length > 0 ||
    tableRows.length > 0 ||
    (compareAreas && compareAreas.length > 0);

  const isCompare = compareAreas && compareAreas.length > 1;

  // EXCEL / PDF handlers (same logic you already have)
  const downloadExcelSingle = async () => {
    if (!tableRows?.length) return;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(meta?.areas?.[0] || "Data");
    worksheet.columns = [
      { header: "Year", key: "year", width: 10 },
      { header: "Area", key: "area", width: 20 },
      { header: "Avg Price", key: "avgPrice", width: 15 },
      { header: "Total Units", key: "totalUnits", width: 15 },
      { header: "Res Sold", key: "resSold", width: 15 },
      { header: "Office Sold", key: "officeSold", width: 15 },
    ];
    tableRows.forEach((row) => worksheet.addRow(row));
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `realestate_${meta?.areas.join("_")}.xlsx`
    );
  };

  const downloadExcelCompare = async () => {
    if (!compareAreas?.length) return;
    const workbook = new ExcelJS.Workbook();
    compareAreas.forEach((area) => {
      const ws = workbook.addWorksheet(area.name.slice(0, 31));
      ws.columns = [
        { header: "Year", key: "year", width: 10 },
        { header: "Area", key: "area", width: 20 },
        { header: "Avg Price", key: "avgPrice", width: 15 },
        { header: "Total Units", key: "totalUnits", width: 15 },
        { header: "Res Sold", key: "resSold", width: 15 },
        { header: "Office Sold", key: "officeSold", width: 15 },
      ];
      area.rows.forEach((row) => ws.addRow(row));
    });
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `realestate_compare_${compareAreas
        .map((a) => a.name.replace(/\s+/g, ""))
        .join("_")}.xlsx`
    );
  };

  const downloadPdfSingle = () => {
    if (!tableRows || tableRows.length === 0) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Real Estate Analysis", 14, 18);
    if (meta?.areas) {
      doc.setFontSize(11);
      doc.text(`Area: ${meta.areas.join(", ")}`, 14, 26);
    }
    if (summary) {
      doc.setFontSize(12);
      doc.text("AI Summary:", 14, 36);
      const summaryLines = doc.splitTextToSize(summary, 180);
      doc.text(summaryLines, 14, 44);
    }
    const tableBody = tableRows.map((row) => [
      row.year,
      row.area,
      row.avgPrice,
      row.totalUnits,
      row.resSold,
      row.officeSold,
    ]);
    autoTable(doc, {
      head: [
        ["Year", "Area", "Avg Price", "Total Units", "Res Sold", "Office"],
      ],
      body: tableBody,
      startY: summary ? 60 : 40,
      styles: { fontSize: 9 },
    });
    doc.save(`realestate_${(meta?.areas || ["data"]).join("_")}.pdf`);
  };

  const downloadPdfCompare = () => {
    if (!compareAreas || compareAreas.length === 0) return;
    const doc = new jsPDF();
    compareAreas.forEach((area, idx) => {
      if (idx > 0) doc.addPage();
      doc.setFontSize(16);
      doc.text("Real Estate Comparison", 14, 18);
      doc.setFontSize(12);
      doc.text(`Area: ${area.name}`, 14, 28);
      if (summary) {
        doc.setFontSize(11);
        doc.text("Global AI Summary:", 14, 38);
        const summaryLines = doc.splitTextToSize(summary, 180);
        doc.text(summaryLines, 14, 46);
      }
      const areaBody = area.rows.map((row) => [
        row.year,
        row.area,
        row.avgPrice,
        row.totalUnits,
        row.resSold,
        row.officeSold,
      ]);
      autoTable(doc, {
        head: [
          ["Year", "Area", "Avg Price", "Total Units", "Res Sold", "Office"],
        ],
        body: areaBody,
        startY: summary ? 60 : 40,
        styles: { fontSize: 9 },
      });
    });
    const name =
      "compare_" +
      compareAreas
        .map((a) => a.name)
        .join("_")
        .replace(/\s+/g, "");
    doc.save(`realestate_${name}.pdf`);
  };

  return (
    <div className="min-vh-100 d-flex flex-column font-sans">
      <Header />

      <main className="container py-5 flex-grow-1">
        <ChatBox onSearch={handleSearch} loading={loading} />

        {loading && <LoadingState />}

        {!loading && hasResults && (
          <div className="row g-4">
            <div className="col-12">
              <Summary text={summary} />
            </div>

            <DownloadBar
              isCompare={isCompare}
              onExcelSingle={downloadExcelSingle}
              onPdfSingle={downloadPdfSingle}
              onExcelCompare={downloadExcelCompare}
              onPdfCompare={downloadPdfCompare}
            />

            {isCompare ? (
              <CompareAreaStrip areas={compareAreas} />
            ) : (
              <>
                <div className="col-12">
                  <ChartDisplay data={chartData} />
                </div>
                <div className="col-12">
                  <TableDisplay rows={tableRows} />
                </div>
              </>
            )}

            {meta && (
              <div className="col-12">
                <div className="d-flex justify-content-between text-muted small px-2 pb-4">
                  <div className="d-flex gap-3">
                    <span className="d-flex align-items-center gap-1">
                      <MapPin size={14} />
                      Areas: {meta.areas.join(", ")}
                    </span>
                    <span>Rows: {meta.rows_returned}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span>The Summary is Powered by Gemini 2.5</span>
                    <div
                      className="bg-primary rounded-circle"
                      style={{ width: 8, height: 8 }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
