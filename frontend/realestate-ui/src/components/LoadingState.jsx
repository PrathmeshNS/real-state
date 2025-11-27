import React from "react";

const LoadingState = () => (
  <div className="text-center py-5">
    <div
      className="spinner-border text-primary"
      style={{ width: "3rem", height: "3rem" }}
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="mt-3 text-muted">Analyzing market data...</p>
  </div>
);

export default LoadingState;
