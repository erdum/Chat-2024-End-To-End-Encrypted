import { createContext, useState } from "react";

export const MessagesContext = createContext();

export const MessagesProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  return (
    <MessagesContext.Provider value={{
      messages,
    }}>
      {children}
    </MessagesContext.Provider>
  );
};
