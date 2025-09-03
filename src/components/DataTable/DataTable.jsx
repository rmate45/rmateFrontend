import React from "react";

const DataTable = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[100px] bg-white border border-gray-300 text-left">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-2 py-1 font-semibold text-introPrimary border border-gray-300 jost text-xs md:text-sm"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx} className="even:bg-white odd:bg-gray-50">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-2 py-1 border border-gray-300 jost text-introPrimary text-sm md:text-sm"
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
