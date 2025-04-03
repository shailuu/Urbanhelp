import React from 'react';
import './Dialog.css'; // Keep your existing styles

const Dialog = ({ isOpen, onClose, title, children }) => {
  console.log("Dialog render with isOpen:", isOpen);
  
  // Don't render anything if not open
  if (!isOpen) {
    return null;
  }

  // Force inline styles to ensure visibility
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999 // Very high z-index to ensure it's on top
  };

  const modalStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '400px',
    maxWidth: '90%',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 10000,
    position: 'relative'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: 0
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1
  };

  // Using inline styles to guarantee visibility
  return (
    <div style={overlayStyle} onClick={onClose} className="modal-overlay">
      <div 
        style={modalStyle} 
        className="modal" 
        onClick={e => e.stopPropagation()}
      >
        <div style={headerStyle} className="modal-header">
          <h2 style={titleStyle} className="modal-title">{title}</h2>
          <button 
            style={closeButtonStyle}
            className="modal-close" 
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;