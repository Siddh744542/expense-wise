import React from "react";

function IncomeSummary({ summaryData }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow h-full">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="text-primary font-semibold text-xl flex justify-between">
            Total Income:
            <div className="text-action font-bold text-lg">₹{summaryData?.totalIncome || 0}</div>
          </div>
        </div>

        {/* Income Sources */}
        <div className="flex flex-col gap-0.5 overflow-y-auto h-[11rem]">
          {summaryData?.sources.length > 0 ? (
            summaryData?.sources.map((source, index) => (
              <div key={source?._id} className="pr-2">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 text-sm ">{source?.source} :</p>
                  <p className="text-gray-500 text-sm"> ₹{source?.total}</p>
                </div>
                {index < summaryData.sources.length - 1 && <hr className="border-gray-300 my-1" />}
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm">No Income source available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default IncomeSummary;
