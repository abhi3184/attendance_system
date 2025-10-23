import React from "react";

export default function AttendancePreview({ attendance = [] }) {
  // Helper to get day name from date string
  console.log("Data",attendance)
  const getDayName = (dateStr) => { 
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleString("en-US", { weekday: "long" });
  };

  // Helper to format date as DD
  const getDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    return String(dateObj.getDate()).padStart(2, "0");
  };

  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse">
        <tbody>
          {attendance.map((item, index) => (
            <tr
              key={index}
              className=" mb-2 rounded-lg"
            >
              {/* Column 1: Week + Date */}
              <td className="align-middle w-1/6">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="font-semibold text-gray-700 text-sm">
                    {getDayName(item.date)}
                    
                  </div>
                  <div className="mt-1 font-medium w-8 h-8 flex items-center justify-center bg-purple-200 text-purple-800 text-sm rounded">
                    {getDate(item.date)}
                  </div>
                </div>
              </td>

              {/* Column 2: Activity + Time */}
              <td className="p-3 align-middle w-2/6">
                <div className="flex flex-col justify-center h-full bg-purple-100 border-l-4 border-purple-500 rounded-lg p-3">
                  <div className="text-gray-700 text-sm font-semibold">
                    IT General
                  </div>
                  <div className="text-gray-500 text-xs font-semibold">
                    10:00 AM - 07:00 PM
                  </div>
                </div>
              </td>

              {/* Column 3: Status */}
              <td className="p-4 align-middle w-4/6 text-right">
                <div className="flex items-center justify-center h-full">
                  <span
                    className={`px-3 font-medium py-1 rounded-full text-white text-xs ${item.status.toLowerCase() === "present"
                        ? "bg-green-500"
                        : item.status.toLowerCase() === "holiday"
                          ? "bg-purple-500"
                          : item.status.toLowerCase() === "weekend"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                  >
                    {item.status}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
