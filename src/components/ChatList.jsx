import { formatTimeAgo } from "../utils/date";

export default function ChatList({ chats, activeChatId, onSelect }) {
  return (
    <ul className="space-y-1">
      {chats.map((c) => {
        const isActive = c.id === activeChatId;
        return (
          <li key={c.id}>
            <button
              onClick={() => onSelect(c.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition flex flex-col
                ${
                  isActive
                    ? "bg-gray-800 border border-gray-600"
                    : "bg-gray-800 border border-transparent hover:bg-gray-700"
                }`}
            >
              <div
                className={`truncate font-medium transition-colors
                  ${
                    isActive
                      ? "text-yellow-400"
                      : "text-gray-200 group-hover:text-white"
                  }`}
              >
                {c.title || "Untitled"}
              </div>
              <div
                className={`text-xs transition-colors
                  ${isActive ? "text-gray-400" : "text-gray-500"}`}
              >
                {formatTimeAgo(c.updated_at)}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
