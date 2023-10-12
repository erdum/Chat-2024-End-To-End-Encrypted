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
  const [selectedUserPublicKey, setSelectedUserPublicKey] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { keyInstance } = useContext(CryptoKeyContext);

  useEffect(() => {
    (async () => {
      const seenMessages = await IndexedDB.getMessages(currentUser.uid);
      setMessages(seenMessages);
    })();
  }, []);

  useEffect(() => {

    if (!selectedUserPublicKey) return;
    console.log(selectedUserPublicKey);
    const unsub = onSnapshot(
      doc(db, "users", currentUser.uid),
      async userDoc => {
        const unreadCiphers = userDoc.data().unreadCiphers ?? [];

        if (unreadCiphers.length > 0) {
          const [decodedCiphers, successfulCiphers] = await Crypto.decodeAllCiphers(
            unreadCiphers,
            keyInstance.privateKey,
            selectedUserPublicKey
          );
          const unreadMessages = decodedCiphers.map(text => JSON.parse(text));
          setMessages(prevMessages => {
            IndexedDB.saveMessages([...prevMessages, ...unreadMessages], currentUser.uid);
            return [...prevMessages, ...unreadMessages];
          });

          if (successfulCiphers.length > 0) {
            await updateDoc(
              doc(db, "users", currentUser.uid),
              {
                unreadCiphers: arrayRemove(...successfulCiphers)
              }
            );
          }
        }
      }
    );
    return () => unsub()
  }, [selectedUserPublicKey]);

  useEffect(() => {

    if (!selectedUser) return;
    const unsub = onSnapshot(
      doc(db, "users", selectedUser.uid), 
      userDoc => setSelectedUserPublicKey(userDoc.data().publicKey)
    );
    return () => unsub();
  }, [selectedUser]);

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
          <Chats
            selectedUser={selectedUser}
            messages={messages}
          />
          <Input
            selectedUser={selectedUser}
            selectedUserPublicKey={selectedUserPublicKey}
            addMessage={setMessages}
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
