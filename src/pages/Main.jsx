import React, { useEffect, useMemo, useState } from "react";
import { FaComments } from "react-icons/fa";
import { FaPlus, FaTimes } from "react-icons/fa";

import Sidebar from "../components/Sidebar.jsx";
import MessageWindow from "../components/MessageWindow.jsx";
import { gql, Q_LIST_CHATS, M_NEW_CHAT } from "../api/graphql.js";

export default function Main() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");

  async function loadChats() {
    setLoading(true);
    setError("");
    try {
      const data = await gql(Q_LIST_CHATS);
      const reverseChats = data?.chats_chats?.reverse();

      setChats(reverseChats || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadChats();
  }, []);

  const createNewChat = async () => {
    if (!newChatTitle.trim()) return;

    try {
      const users = await gql(`query {users {id, email}}`);
      const userId = users?.users[0]?.id;

      console.log(userId);

      const newChat = await gql(M_NEW_CHAT, {
        title: newChatTitle,
        user_id: userId,
      });

      const chatId = newChat?.insert_chats_chats_one?.id;

      if (newChat) {
        setChats((prev) => [newChat.insert_chats_chats_one, ...prev]);
        setActiveChatId(chatId);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setShowModal(false);
      setNewChatTitle("");
    }
  };

  const onSelectChat = (id) => setActiveChatId(id);

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId),
    [chats, activeChatId]
  );

  return (
    <div className="h-full flex">
      <div>
        <Sidebar
          chats={chats}
          onNewChat={() => setShowModal(true)}
          onSelectChat={onSelectChat}
          activeChatId={activeChatId}
          loading={loading}
          error={error}
        />
      </div>

      <div className="border-l bg-gray-800 grow">
        {activeChat ? (
          <MessageWindow chat={activeChat} key={activeChat.id} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-sm px-4">
              {/* Action Button */}
              <button
                onClick={() => setShowModal(true)}
                className="px-5 py-2.5 rounded-xl bg-gray-800 text-yellow-400 font-medium 
                 shadow-[0_0_10px_rgba(250,204,21,0.4)] 
                 hover:bg-gray-700 hover:shadow-[0_0_15px_rgba(250,204,21,0.6)] 
                 transition flex items-center gap-2 mx-auto cursor-pointer"
              >
                <FaComments />
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-gray-900 p-6 rounded-2xl shadow-xl w-[400px] border border-gray-800">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                Enter Chat Title
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-yellow-400 transition cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {/* Input */}
            <input
              type="text"
              value={newChatTitle}
              onChange={(e) => setNewChatTitle(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 mb-4 text-white 
                 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 
                 focus:border-yellow-400 transition"
              placeholder="Chat title..."
            />

            {/* Footer Actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-600 text-gray-300 
                   hover:bg-gray-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={createNewChat}
                className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-medium flex items-center gap-2
                   shadow-[0_0_10px_rgba(250,204,21,0.4)] hover:shadow-[0_0_15px_rgba(250,204,21,0.6)]
                   transition cursor-pointer"
              >
                <FaPlus />
                Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
