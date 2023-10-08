import { useContext } from "react";
import ChatPartnerHeader from "./ChatPartnerHeader";
import Chats from "./Chats";
import Input from "./Input";
import Logo from "./Logo";
import { MessagesContext } from "./context/MessagesContext";

const MainContent = () => {
  const { selectedUser } = useContext(MessagesContext);

  return (
    <>
      {selectedUser ? (
        <div className="relative">
          <ChatPartnerHeader user={selectedUser} />
          <Chats selectedUser={selectedUser} />
          <Input selectedUser={selectedUser} />
        </div>
      ) : (
        <div className="bg-slate-200 h-full flex justify-center items-center text-center flex-col">
          <Logo />
          <p className="mt-8">Click on the user to start chatting...</p>
        </div>
      )}
    </>
  );
};

export default MainContent;
