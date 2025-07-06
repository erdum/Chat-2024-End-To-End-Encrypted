import { useContext, useRef, useMemo, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useStore } from "../../store";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  return time;
};

const Chats = ({ selectedUser }) => {
  const { currentUser } = useContext(AuthContext);
  const chatRef = useRef(null);
  const messages = useStore((state) => state.messages);

  const filteredMessages = useMemo(
    () => messages[selectedUser],
    [messages, selectedUser]
  ) ?? [];

  useEffect(() => scrollToBottom(), [filteredMessages]);

  const scrollToBottom = () => {
    chatRef.current?.scrollIntoView({ behavoir: "smooth" });
  };

  return (
    <div className="chats absolute top-16 inset-x-0 p-4 h-[calc(100%-128px)] overflow-y-auto bg-slate-200">
      {filteredMessages.map((message) => {
        return (
          <div
            className={`relative flex ${
              message.sender == currentUser.email
                ? "justify-end"
                : "justify-start"
            }`}
            key={message.timestamp}
          >
            {message.imageUrl ? (
              <div
                className={`shadow mb-1 p-1 rounded-lg max-w-[80%] lg:max-w-[60%] ${
                  message.sender == currentUser.email
                    ? "bg-emerald-500 text-white rounded-tr-none"
                    : "bg-white text-slate-600 rounded-tl-none"
                }`}
              >
                <img
                  src={message.imageUrl}
                  alt="Chat Image"
                  className="max-w-[200px] mx-auto mb-2 rounded-md"
                />
                <div className="flex justify-between items-end px-1">
                  <p className="py-1 px-2">{message.message}</p>
                  {message.timestamp && (
                    <p
                      className={`text-[11px] ${
                        message.sender == currentUser.email
                          ? "text-slate-200"
                          : "text-slate-400"
                      }`}
                    >
                      {formatTimestamp(message.timestamp)}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={`flex items-end shadow mb-1 py-1 px-2 rounded-lg max-w-[80%] lg:max-w-[60%] ${
                  message.sender == currentUser.email
                    ? "bg-emerald-500 text-white rounded-tr-none"
                    : "bg-white text-slate-600 rounded-tl-none"
                }`}
              >
                <p className="py-1 px-2">{message.message}</p>
                {message.timestamp && (
                  <p
                    className={`text-[11px] ${
                      message.sender == currentUser.email
                        ? "text-slate-200"
                        : "text-slate-400"
                    }`}
                  >
                    {formatTimestamp(message.timestamp)}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
      <div ref={chatRef}></div>
    </div>
  );
};

export default Chats;
