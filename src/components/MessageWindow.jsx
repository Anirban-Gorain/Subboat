import React, { useEffect, useRef, useState } from "react";
import { gql, Q_LIST_MESSAGES, M_INSERT_MESSAGE } from "../api/graphql.js";
import MessageInput from "./MessageInput.jsx";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { initWsClient } from "../api/wsClient.js";
import { useGraphQLSubscription } from "../hooks/hooks.js";
import Markdown from "./Markdown.jsx";

const MESSAGES_SUB = `
  subscription Messages($chatId: uuid!, $limit: Int!) {
    messages_messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
      limit: $limit
    ) {
      id
      chat_id
      sender
      content
      created_at
    }
  }
`;

export default function MessageWindow({ chat }) {
  const { data, loading, error } = useGraphQLSubscription({
    query: MESSAGES_SUB,
    variables: { chatId: chat.id, limit: 50 },
  });

  const [replaying, setReplaying] = useState(false);

  const messages = data;

  const sendMessage = async (content) => {
    if (!content.trim()) return;

    try {
      setReplaying(true);

      gql(M_INSERT_MESSAGE, {
        chat_id: chat.id,
        content,
        sender: "user",
      });
    } catch (e) {
      alert(e.message);
    }
  };

  const messageEndRef = useRef(null);

  console.log(replaying);

  useEffect(() => {
    if (data?.length > 0 && data[data.length - 1].sender != "user") {
      setReplaying(false);
    } else {
      setTimeout(
        () => messageEndRef.current.scrollIntoView({ behavior: "smooth" }),
        1500
      );
    }
  }, [data]);

  return (
    <div className="h-full flex flex-col overflow-auto">
      <div className="px-4 py-3 border-b border-gray-800 bg-gray-900 flex items-center gap-2">
        <HiOutlineChatBubbleLeftRight className="w-5 h-5 text-yellow-400" />
        <h2 className="font-semibold text-white text-lg">
          {chat.title || "Chat"}
        </h2>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-9 w-9 border-4 border-yellow-300 border-t-yellow-500"></div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center h-full text-red-600 text-sm">
            {error}
          </div>
        )}

        {messages?.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <p className="text-3xl font-bold">What’s on your mind today?</p>
          </div>
        ) : (
          messages?.map((m) => (
            <div
              key={m.id}
              className={`w-fit max-w-[70%] ${
                m.sender === "user" ? "ml-auto text-right" : "mr-auto text-left"
              }`}
            >
              <div
                className={`px-4 py-2 rounded shadow-sm  transition-all bg-gray-700 text-gray-300`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  <Markdown message={m.content} />
                </div>
              </div>
              <div className="text-[11px] text-gray-400 mt-1">
                {new Date(m.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))
        )}

        {replaying && (
          <div className="w-fit max-w-[60%] mr-auto text-left">
            <div className="px-4 py-2 rounded shadow-sm bg-gray-700 text-gray-300">
              <div className="flex gap-1 items-center">
                <span className="animate-bounce w-2 h-2 bg-gray-400 rounded-full"></span>
                <span className="animate-bounce w-2 h-2 bg-gray-400 rounded-full delay-150"></span>
                <span className="animate-bounce w-2 h-2 bg-gray-400 rounded-full delay-300"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messageEndRef} />
      </div>

      <div className="p-3 mb-5">
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
}
