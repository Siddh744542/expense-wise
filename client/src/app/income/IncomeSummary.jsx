import React from "react";

function IncomeSummary({ summaryData }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow h-full">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="text-primary-600 font-semibold text-xl flex justify-between">
            Total Income:
            <div className="text-action font-bold text-lg">₹{summaryData?.totalIncome || 0}</div>
          </div>
        </div>

        {/* Income Sources */}
        <div className="flex flex-col gap-1.5">
          {summaryData?.sources.length > 0 ? (
            summaryData?.sources.map((source, index) => (
              <>
                <div key={source?._id} className="flex justify-between items-center">
                  <p className="text-gray-600 font-semibold text-sm ">{source?.source}:</p>
                  <p className="text-gray-500 text-sm"> ₹{source?.total}</p>
                </div>
                {index < summaryData.sources.length - 1 && <hr className="border-gray-300" />}
              </>
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
