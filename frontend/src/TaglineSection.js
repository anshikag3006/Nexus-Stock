import React from 'react';
import './TaglineSection.css';

const TaglineSection = ({ totalProducts }) => {
  return (
    <div className="tagline-glass"> {/* Ensure this matches the CSS class */}
      <div className="tagline-header">
        <h3>📦 Nexus Inventory Hub</h3>
        <div className="live-status">
           <span className="pulse"></span>
           Operational
        </div>
      </div>
      <p>Intelligent stock management for high-performance businesses.</p>
      <div className="status-row">
          <div className="count-pill">Active SKUs: {totalProducts}</div>
      </div>
    </div>
  );
};

export default TaglineSection;