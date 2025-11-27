import React from "react";

const DownloadBar = ({
  isCompare,
  onExcelSingle,
  onPdfSingle,
  onExcelCompare,
  onPdfCompare,
}) => {
  return (
    <div className="col-12 d-flex justify-content-end gap-2">
      {isCompare ? (
        <>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={onExcelCompare}
          >
            Download Comparison (Excel)
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={onPdfCompare}
          >
            Download Comparison (PDF)
          </button>
        </>
      ) : (
        <>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={onExcelSingle}
          >
            Download Data (Excel)
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={onPdfSingle}
          >
            Download Data (PDF)
          </button>
        </>
      )}
    </div>
  );
};

export default DownloadBar;
