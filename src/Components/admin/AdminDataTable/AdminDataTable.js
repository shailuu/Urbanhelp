import React from 'react';
import './AdminDataTable.css';

const AdminDataTable = ({ columns, data, loading, onEdit, onDelete }) => {
  return (
    <div className="admin-table-container">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {column.isAction ? (
                      <div className="action-buttons">
                        <button 
                          className="edit-btn"
                          onClick={() => onEdit(item[column.accessor])}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => onDelete(item[column.accessor])}
                        >
                          Delete
                        </button>
                      </div>
                    ) : column.format ? (
                      column.format(item[column.accessor])
                    ) : (
                      item[column.accessor]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDataTable;