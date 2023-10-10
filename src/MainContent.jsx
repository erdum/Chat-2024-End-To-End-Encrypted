import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { CryptoKeyContext } from "./context/CryptoKeyContext";
import { db } from "./firebase";
import { 
  doc,
  updateDoc,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
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

  useEffect(() => {
    getSeenMessages(currentUser.uid);
  }, []);

  useEffect(() => {

    if (!keyInstance) return;
    const unsubMessagesListener = getUnseenMessages(
      currentUser.uid, keyInstance.privateKey
    );
    return () => unsubMessagesListener();
  }, [keyInstance]);

  const getSeenMessages = async (uid) => {
    const seenMessages = await IndexedDB.getMessages(uid);
    setMessages(seenMessages);
  };

  const getUnseenMessages = (uid, receiverPrivateKey) => {
    return onSnapshot(doc(db, "users", uid), async (userDocSnap) => {
      const unreadCiphers = userDocSnap.data().unreadCiphers ?? [];
      const unreadMessages = await Crypto.decodeAllCiphers(
        unreadCiphers,
        receiverPrivateKey
      );

      if (unreadMessages.length > 0) {
        setMessages(prevState => {
          IndexedDB.saveMessages([...prevState, ...unreadMessages], uid);
          return ([...prevState, ...unreadMessages]);
        });
        await updateDoc(doc(db, "users", uid), {
          unreadCiphers: arrayRemove(...unreadCiphers)
        });
      }
    });
  };

  return (
    <>
      {selectedUser ? (
        <div className="relative">
          <ChatPartnerHeader
            user={selectedUser}
            clearMessages={
              async () => {
                setMessages([]);
                await IndexedDB.clearOnlyMessages();
              }
            }
          />
          <Chats selectedUser={selectedUser} messages={messages} />
          <Input selectedUser={selectedUser} addSentMessageToMessages={setMessages} />
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
