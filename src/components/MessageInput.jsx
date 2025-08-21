import React, { useRef, useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";

export default function MessageInput({ onSend }) {
  const [value, setValue] = useState("");
  const taRef = useRef(null);

  const MAX_ROWS = 6;
  const LINE_HEIGHT = 24;
  const MAX_HEIGHT = MAX_ROWS * LINE_HEIGHT;

  const resize = () => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    const newHeight = Math.min(el.scrollHeight, MAX_HEIGHT);
    el.style.height = `${newHeight}px`;
    el.style.overflowY = el.scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
  };

  useEffect(() => {
    resize();
  }, [value]);

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 bg-gray-700 border-gray-200 rounded-4xl px-5 py-2 shadow-sm">
      <textarea
        ref={taRef}
        className="custom-scrollbar flex-1 resize-none bg-transparent border-none outline-none px-2 py-2 text-white placeholder-gray-400 focus:ring-0 leading-6"
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onInput={resize}
        placeholder="Ask anything"
        style={{ maxHeight: MAX_HEIGHT }}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSend}
        className="flex items-center justify-center rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-500 text-white px-4 py-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <IoSend className="w-5 h-5" />
      </button>
    </div>
  );
}
