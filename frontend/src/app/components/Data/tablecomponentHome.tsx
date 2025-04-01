import React from "react";
import { Call } from "./callTableHome";

// Extend the Call interface for the table to include the onView function
interface TableCall extends Call {
  onView: (type: "transcription" | "report") => void;
}

interface TableComponentProps {
  calls: TableCall[];
}

const TableComponent: React.FC<TableComponentProps> = ({ calls }) => {
  // Function to convert a date string (e.g., "2025-03-25") to "X days ago"
  const getDaysAgo = (dateString: string) => {
    const today = new Date("2025-03-31"); // Current date as per your context
    const callDate = new Date(dateString);
    const diffTime = Math.abs(today.getTime() - callDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-white mb-4">Call History</h3>
      {/* Add overflow-x-auto for horizontal scrolling on small screens */}
      <div className="overflow-x-auto">
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden min-w-[800px]">
          <table className="w-full text-left table-fixed">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-white font-semibold w-1/6">
                  Client
                  <svg
                    className="inline-block ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </th>
                <th className="py-3 px-4 text-white font-semibold w-1/6">
                  Date
                  <svg
                    className="inline-block ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </th>
                <th className="py-3 px-4 text-white font-semibold w-1/6">
                  Length
                </th>
                <th className="py-3 px-4 text-white font-semibold w-1/4">
                  Sentiment Score
                </th>
                <th className="py-3 px-4 text-white font-semibold w-1/12">
                  Transcript
                </th>
                <th className="py-3 px-4 text-white font-semibold w-1/12">
                  Report
                </th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call) => (
                <tr key={call.id} className="border-t border-gray-700">
                  <td className="py-3 px-4 text-white w-1/6 truncate">
                    {call.name}
                  </td>
                  <td className="py-3 px-4 text-white w-1/6">
                    {getDaysAgo(call.date)}
                  </td>
                  <td className="py-3 px-4 text-white w-1/6">
                    {call.duration}
                  </td>
                  <td className="py-3 px-4 text-white w-1/4 flex items-center">
                    <div
                      className="h-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded"
                      style={{ width: `${call.sentimentScore}%` }}
                    ></div>
                    <span className="ml-2">{call.sentimentScore}</span>
                  </td>
                  <td className="py-3 px-4 w-1/12">
                    <button onClick={() => call.onView("transcription")}>
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </button>
                  </td>
                  <td className="py-3 px-4 w-1/12">
                    <button onClick={() => call.onView("report")}>
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 15v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;
