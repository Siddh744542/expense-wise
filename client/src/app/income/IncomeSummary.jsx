import React from "react";

function IncomeSummary({ summaryData }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow h-auto">
      <div className="space-y-2">
        <div className="space-y-2">
          <div className="text-primary-600 font-semibold text-xl flex justify-between">
            Total Income:
            <div className="text-action font-bold text-2xl">
              ₹{summaryData?.totalIncome || 0}
            </div>
          </div>
        </div>

        {/* Income Sources */}
        <div className="space-y-2">
          {summaryData?.sources.length > 0 ? (
            summaryData?.sources.map((source) => (
              <div
                key={source?._id}
                className="flex justify-between items-center border-b pb-2 mb-2"
              >
                <p className="text-gray-700 font-medium">{source?.source}:</p>
                <p className="text-gray-500"> ₹{source?.total}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No Income source available</p>
          )}
        </div>
      </div>

      {/* {error && <p className="text-red-500">{error}</p>} */}
    </div>
  );
}

export default IncomeSummary;
