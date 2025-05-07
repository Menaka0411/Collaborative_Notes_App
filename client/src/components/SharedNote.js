import React from "react";
import { useNavigate } from "react-router-dom";

const SharedNotes = ({ sharedNotes, handleAcceptAndNavigate }) => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {sharedNotes.map((shared) => {
        const isSender = String(shared.sharedById) === String(userId);
        const userStatus = shared.sharedWith.find(u => u.userId === userId);
        const isAccepted = userStatus?.accepted;

        return (
          <div
            key={shared._id}
            className="w-full sm:w-[90%] md:w-full h-[240px] bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-400 shadow-md rounded-[30px_5px_30px_5px] p-4 
              cursor-pointer hover:shadow-xl transition-all duration-300 ease-in-out text-sm relative overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400 rounded-t-[30px]" />

            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-[20px] leading-tight w-[70%] truncate">
                  {shared.title}
                </h3>
                <span className="text-[10px] text-gray-500 text-right w-[30%] truncate">
                  Shared by: {shared.sharedByUsername || "Unknown"}
                </span>
              </div>

              <div
                className="text-gray-800 text-[12px] leading-snug mt-1 prose prose-sm"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 5,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
                dangerouslySetInnerHTML={{ __html: shared.content }}
              />
            </div>

            <div className="absolute bottom-2 right-4 left-4 flex justify-between items-center">
            {!isSender && (
            <button
              onClick={() => {
                if (!isAccepted) {
                  handleAcceptAndNavigate(shared._id);
                } else {
                  navigate(`/shared/${shared._id}`);
                }
              }}
              className={`px-4 py-2 rounded-full text-white text-xs font-medium shadow-md transition-all ${
                isAccepted
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isAccepted ? "Accept & Open" : "Invited"}
            </button>
          )}

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SharedNotes;
