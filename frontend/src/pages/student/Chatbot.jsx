import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { type: "user", text: message };
    setChat(prev => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("/api/ai/chat", { message });
      const botMsg = { type: "bot", text: res.data.reply };
      setChat(prev => [...prev, botMsg]);
    } catch (error) {
      setChat(prev => [...prev, { 
        type: "bot", 
        text: "Something went wrong. Please try again." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Formats **bold** and newlines properly
  const formatMessage = (text) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="mb-1">
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">AI Learning Assistant</h1>

      {/* Chat messages - takes all available space */}
      <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-white space-y-4">
        
        {chat.length === 0 && (
          <p className="text-gray-400 text-center mt-32">
            Ask me anything to get started!
          </p>
        )}

        {chat.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
              msg.type === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}>
              {msg.type === "bot" ? formatMessage(msg.text) : msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 p-3 rounded-lg text-sm italic">
              Thinking...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input always anchored at bottom */}
      <div className="flex gap-2">
        <input
          className="border rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
          placeholder="Ask something..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}