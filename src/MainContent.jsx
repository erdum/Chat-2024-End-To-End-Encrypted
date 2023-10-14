import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { CryptoKeyContext } from "./context/CryptoKeyContext";
import { DatabaseContext } from "./context/DatabaseContext";
import ChatPartnerHeader from "./ChatPartnerHeader";
import Chats from "./Chats";
import Input from "./Input";
import Logo from "./Logo";
import IndexedDB from "./indexedDB";
import Crypto from "./crypto";

const MainContent = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { keyInstance } = useContext(CryptoKeyContext);
  const { ciphers, publicKeys, removeDecodedCiphers } = useContext(DatabaseContext);

  useEffect(() => {

    if (!selectedUser || ciphers.length === 0) return;
    (async () => {
      const [decodedCiphers, successfulCiphers] = await Crypto.decodeAllCiphers(
        ciphers,
        keyInstance.privateKey,
        publicKeys[selectedUser.uid],
      );
      const unreadMessages = decodedCiphers.map(cipher => JSON.parse(cipher));
      setMessages(prevMessages => {
        IndexedDB.saveMessages([...prevMessages, ...unreadMessages], currentUser.uid);
        return [...prevMessages, ...unreadMessages];
      });
      removeDecodedCiphers(currentUser.uid, successfulCiphers);
    })();
  }, [ciphers, selectedUser]);

  useEffect(() => {

    if (!currentUser) return;

    (async () => {
      const seenMessages = await IndexedDB.getMessages(currentUser.uid);
      setMessages(seenMessages);
    })();
  }, [currentUser]);

  return (
    <>
      {selectedUser ? (
        <div className="relative">
          <ChatPartnerHeader
            user={selectedUser}
            clearMessages={() => {
              setMessages([]);
              IndexedDB.clearOnlyMessages();
            }}
          />
          <Chats
            selectedUser={selectedUser}
            messages={messages}
          />
          <Input
            selectedUser={selectedUser}
            setMessages={setMessages}
          />
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
