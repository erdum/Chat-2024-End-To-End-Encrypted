import { useContext, useRef, useMemo, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  return time;
};

const Chats = ({ selectedUser, messages }) => {
  const { currentUser } = useContext(AuthContext);
  const chatRef = useRef(null);

  const filteredMessages = useMemo(
    () => messages.filter(message => {
      return (
        (
          message.receiverId == currentUser.uid
          && message.senderId == selectedUser.uid
        )
        || (
          message.receiverId == selectedUser.uid
          && message.senderId == currentUser.uid
        )
      );
    }),
    [messages, selectedUser]
  );

  useEffect(() => scrollToBottom(), [filteredMessages]);

  const scrollToBottom = () => {
    chatRef.current?.scrollIntoView({ behavoir: "smooth" });
  };

  return (
    <div className="chats p-4 h-[calc(100vh-128px)] overflow-y-auto bg-slate-200">
      {filteredMessages.map((message) => {
        return (
          <div
            className={`relative flex ${
              message.senderId == currentUser.uid
                ? "justify-end"
                : "justify-start"
            }`}
            key={message.timestamp}
          >
            {message.imageUrl ? (
              <div
                className={`shadow mb-1 p-1 rounded-lg max-w-[80%] lg:max-w-[60%] ${
                  message.senderId == currentUser.uid
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
                        message.senderId == currentUser.uid
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
                  message.senderId == currentUser.uid
                    ? "bg-emerald-500 text-white rounded-tr-none"
                    : "bg-white text-slate-600 rounded-tl-none"
                }`}
              >
                <p className="py-1 px-2">{message.message}</p>
                {message.timestamp && (
                  <p
                    className={`text-[11px] ${
                      message.senderId == currentUser.uid
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
