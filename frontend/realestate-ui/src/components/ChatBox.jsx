// src/components/ChatBox.jsx
import React, { useState } from "react";
import { Search } from "lucide-react";

const ChatBox = ({ onSearch, loading }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  };

  return (
    <div className="text-center mb-5">
      <h2 className="display-5 fw-bold text-dark mb-3">
        Analyze any locality instantly.
      </h2>
      <p className="text-muted mb-4 lead">
        Try asking about{" "}
        <span className="fw-semibold text-dark">Wakad</span>,{" "}
        <span className="fw-semibold text-dark">Aundh</span>, or{" "}
        <span className="fw-semibold text-dark">Ambegaon Budruk</span>...
      </p>

      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <form onSubmit={handleSubmit}>
            <div className="input-group input-group-lg shadow-sm">
              <input
                type="text"
                className="form-control search-input py-3 border-secondary-subtle"
                placeholder="Enter locality (e.g., Give me analysis of Wakad)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                className="btn btn-primary search-btn d-flex align-items-center gap-2"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div
                    className="spinner-border spinner-border-sm text-white"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <>
                    Analyze <Search size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
