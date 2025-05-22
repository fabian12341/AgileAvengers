import React from "react";
import { CallSearchProps } from "@/app/types/CallSearchProps";

const CallSearch: React.FC<CallSearchProps> = ({
  searchId,
  setSearchId,
  searchClient,
  setSearchClient,
  searchDate,
  setSearchDate,
}) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mt-4">
        Search for transcript or report
      </h2>
      <p className="text-gray-400 mb-4">
        Fill in the necessary fields to find a specific call.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="Call ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="bg-gray-800 p-2 rounded-md w-full border border-gray-600 text-white"
        />
        <input
          type="text"
          placeholder="Client"
          value={searchClient}
          onChange={(e) => setSearchClient(e.target.value)}
          className="bg-gray-800 p-2 rounded-md w-full border border-gray-600 text-white"
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="bg-gray-800 p-2 rounded-md w-full border border-gray-600 text-white"
          data-testid="date-input"
        />
      </div>
    </div>
  );
};

export default CallSearch;
