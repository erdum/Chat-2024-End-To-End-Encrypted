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
  const [ciphers, setCiphers] = useState([]);
  const [selectedUserPublicKey, setSelectedUserPublicKey] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { keyInstance } = useContext(CryptoKeyContext);

  useEffect(() => {
    (async () => {
      const ciphersFromDevice = await IndexedDB.getMessages(currentUser.uid);
      setCiphers(ciphersFromDevice);
    })();
  }, []);

  useEffect(() => {

    if (!keyInstance) return;
    const unsubCipherListener = getRemoteCiphers(
      currentUser.uid, keyInstance.privateKey
    );
    return () => unsubCipherListener();
  }, [keyInstance]);

  useEffect(() => {

    if (!selectedUser) return;
    const unsub = onSnapshot(
      doc(db, "users", selectedUser.uid), 
      userDoc => setSelectedUserPublicKey(userDoc.data().publicKey)
    );
    return () => unsub();
  }, [selectedUser]);

  const getRemoteCiphers = (uid, receiverPrivateKey, senderPublicKey) => {
    return onSnapshot(doc(db, "users", uid), async (userDocSnap) => {
      const unreadCiphers = userDocSnap.data().unreadCiphers ?? [];

      if (unreadCiphers.length > 0) {
        setCiphers(prevState => {
          IndexedDB.saveMessages([...prevState, ...unreadCiphers], uid);
          return ([...prevState, ...unreadCiphers]);
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
                setCiphers([]);
                await IndexedDB.clearOnlyMessages();
              }
            }
          />
          <Chats selectedUser={selectedUser} ciphers={ciphers} />
          <Input
            selectedUser={selectedUser}
            selectedUserPublicKey={selectedUserPublicKey}
            addSentMessageToMessages={setCiphers}
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
