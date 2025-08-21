import React from "react";
import { FaPlus, FaSignOutAlt } from "react-icons/fa";
import ChatList from "./ChatList.jsx";
import { useSignOut } from "@nhost/react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({
  chats,
  onNewChat,
  onSelectChat,
  activeChatId,
  loading,
  error,
}) {
  const { signOut } = useSignOut();
  const navigate = useNavigate();

  return (
    <aside className="h-screen flex flex-col bg-gray-900 text-white w-64 grow-0">
      <div className="flex items-center justify-between p-4">
        <span className="text-2xl font-bold">
          <span className="text-yellow-400">Sub</span>
          <span>Boat</span>
        </span>
      </div>

      <button
        onClick={onNewChat}
        className="flex items-center justify-center gap-2 mx-4 my-2 py-2 rounded bg-gray-700 hover:bg-gray-600 cursor-pointer transition"
      >
        <FaPlus />
        <span>New Chat</span>
      </button>

      <div className="flex-1 overflow-y-auto mx-4 my-2 custom-scrollbar">
        {loading ? (
          <p className="text-sm text-gray-400">Loading chats…</p>
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : chats.length === 0 ? (
          <p className="text-sm text-gray-400">
            No chats yet. Click "New chat" to begin.
          </p>
        ) : (
          <ChatList
            chats={chats}
            activeChatId={activeChatId}
            onSelect={onSelectChat}
          />
        )}
      </div>

      <div className="mt-auto mx-4 my-2">
        <button
          onClick={() => {
            signOut();
            localStorage.removeItem("accessToken");
            navigate("/auth");
          }}
          className="flex items-center justify-center gap-2 w-full py-2 rounded bg-gray-700 hover:bg-gray-600 cursor-pointer transition"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
