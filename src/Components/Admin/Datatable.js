import React from 'react';

const DataTable = ({ columns, data, renderCell, renderActions }) => {
  console.log("DataTable received data:", data);
  console.log("DataTable received columns:", columns);

  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.title}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data && data.length > 0 ? (
          data.map((item) => (
            <tr key={item._id || item.id}>
              {columns.map((column) => (
                <td key={`${item._id || item.id}-${column.key}`}>
                  {/* Render custom cell content if renderCell is provided */}
                  {renderCell ? renderCell(column, item) : item[column.key]}
                </td>
              ))}
              <td>
                {/* Render custom actions if renderActions is provided */}
                {renderActions ? renderActions(item) : (
                  <div className="action-buttons">
                    <button 
                      className="btn btn-edit" 
                      onClick={() => console.warn("Edit functionality not implemented")}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-delete" 
                      onClick={() => console.warn("Delete functionality not implemented")}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length + 1}>No data available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DataTable;