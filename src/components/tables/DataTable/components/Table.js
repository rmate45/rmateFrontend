import clsx from "clsx";
import React from "react";

const Table = ({
  data = [],
  columns = [],
  onClickRow,
  changeRowColorOnStatus = false, // new prop with default value
}) => {
  if (!data.length || !columns.length) {
    return <div className="p-8 text-center">No data available</div>;
  }

  // Helper to get row background class based on status
  const getRowClassName = (status) => {
    if (!changeRowColorOnStatus) return "bg-white";
    switch (status) {
      case "Paid":
        return "bg-[#3AC8871A]";
      case "Scheduled":
        return "bg-[#A934BD1A]";
      case "Overdue":
        return "bg-[#EC1B281A]";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="border rounded-md overflow-hidden border-transparent">
      <div className="overflow-x-auto">
        <table className="w-full border-transparent overflow-x-auto">
          <thead>
            <tr className="bg-transparent border-transparent">
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className="py-6 px-6 text-center font-medium text-subheadline text-base relative text-nowrap"
                >
                  {column.header}
                  {index < columns.length - 1 && (
                    <span className="absolute right-0 top-7 h-4 w-px bg-subheadline"></span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onClickRow(row.id)}
                className={clsx(
                  `cursor-pointer`,
                  changeRowColorOnStatus
                    ? `${getRowClassName(row.status)}`
                    : "hover:bg-purple-100 bg-white"
                )}
              >
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column.key}`}
                    className="py-6 text-center px-6 font-medium text-subheadline text-base text-nowrap"
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
