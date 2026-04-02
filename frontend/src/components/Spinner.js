import React from 'react';
import './Spinner.css';

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <span className="spinner-text">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
