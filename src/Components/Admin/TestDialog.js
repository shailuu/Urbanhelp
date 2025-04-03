import React from 'react';
import './Dialog.css';

const TestDialog = () => {
  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div className="modal" style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        width: '400px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        <h2>Test Dialog</h2>
        <p>If you can see this, the dialog rendering works!</p>
        <button>Close</button>
      </div>
    </div>
  );
};

export default TestDialog;