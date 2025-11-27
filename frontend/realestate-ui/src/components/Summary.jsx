// src/components/Summary.jsx
import React from "react";
import { Bot } from "lucide-react";

const Summary = ({ text }) => {
  if (!text) return null;

  return (
    <div className="card card-custom summary-gradient p-4">
      <div className="d-flex align-items-start gap-3">
        <div className="bg-white p-2 rounded-circle shadow-sm text-primary">
          <Bot size={28} />
        </div>
        <div>
          <h4 className="fw-bold mb-2">AI Market Summary</h4>
          <p className="mb-0 text-secondary lh-lg">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default Summary;
