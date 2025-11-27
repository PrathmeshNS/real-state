import React from "react";
import { Home } from "lucide-react";

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top shadow-sm">
      <div className="container">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-primary text-white p-2 rounded">
            <Home size={24} />
          </div>
          <div>
            <h5 className="mb-0 fw-bold text-dark">Real Estate AI</h5>
            <small className="text-muted" style={{ fontSize: "0.75rem" }}>
              Intelligent Market Analysis
            </small>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
