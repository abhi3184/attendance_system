import React from "react";

export default function AttendancePreview() {
  const schedule = [
    { day: "Monday", date: "29", activity: "IT General", time: "10:00 AM - 07:00 PM", status: "Present" },
    { day: "Tuesday", date: "30", activity: "IT General", time: "10:00 AM - 07:00 PM", status: "Absent" },
  ];

  return (
    <div className="w-full">
      <table className="w-full border-collapse">
        <tbody>
          {schedule.map((item, index) => (
            <tr key={index} className="bg-gray-50 mb-2 rounded-lg">
              {/* Column 1: Week + Date */}
              <td className="p-4 align-middle w-1/6">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="font-semibold text-gray-700 text-sm">{item.day}</div>
                  <div className="mt-1 w-8 h-8 flex items-center justify-center bg-purple-200 text-purple-800 text-sm rounded">
                    {item.date}
                  </div>
                </div>
              </td>

              {/* Column 2: Activity + Time with background and left border */}
              <td className="p-4 align-middle w-2/6">
                <div className="flex flex-col justify-center h-full bg-purple-100 border-l-4 border-purple-500 rounded-lg p-3">
                  <div className="text-gray-700 text-sm font-semibold">{item.activity}</div>
                  <div className="text-gray-500 text-xs">{item.time}</div>
                </div>
              </td>

              {/* Column 3: Status */}
              <td className="p-4 align-middle w-4/6 text-right">
                <div className="flex items-center justify-center h-full">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs ${
                      item.status === "Present" ? "bg-green-500" : "bg-red-500"
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
