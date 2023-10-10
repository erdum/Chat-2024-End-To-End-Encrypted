import React, { useState, useContext, useRef, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { updateDoc, doc, arrayUnion, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import Loader from "./assets/oval.svg";
import Crypto from "./crypto";
import IndexedDB from "./indexedDB";
import { AuthContext } from "./context/AuthContext";

const Input = ({ selectedUser, addSentMessageToMessages }) => {
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedUserPublicKey, setSelectedUserPublicKey] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const inputRef = useRef(null);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "users", selectedUser.uid), 
      userDoc => setSelectedUserPublicKey(userDoc.data().publicKey)
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleImageChange = (e) => {
    // const file = e.target.files[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     setImagePreview(reader.result);
    //   };
    //   reader.readAsDataURL(file);
    // } else {
    //   setImagePreview(null);
    // }
  };

  const sendMessage = async (e) => {
    setMessage("");
    if (message.trim() !== "" || imagePreview) {
      try {
        // let imageBase64 = null;
        // let imageMetaData = null;

        // if (imagePreview) {
        //   setUploading(true);
        //   const [metaData, image] = imagePreview.split(',');
        //   imageMetaData = metaData;
        //   imageBase64 = image;
        //   setUploading(false);
        //   setImagePreview(null);
        // }
        const payload = {
          senderId: currentUser.uid,
          message,
          timestamp: Date.now(),
        };
        const stringifiedJson = JSON.stringify(payload);
        addSentMessageToMessages(prevMessages => {
          IndexedDB.saveMessages([...prevMessages, stringifiedJson], currentUser.uid);
          return ([...prevMessages, stringifiedJson]);
        });
        const cipher = await Crypto.encodeCipher(stringifiedJson, selectedUserPublicKey);
        
        const userDocRef = doc(db, "users", selectedUser.uid);
        await updateDoc(userDocRef, {
          unreadCiphers: arrayUnion(cipher)
        });
      } catch (error) {
        console.log(error);
        setUploading(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleSendClick = () => {
    sendMessage();
  };

  return (
    <div className="bg-slate-100 h-16 border-t border-slate-200 flex items-center px-8 gap-4">
      <label htmlFor="file">
        <AttachFileIcon
          className="text-gray-600 w-200 text-4xl rotate-45 cursor-pointer"
          style={{ fontSize: 28 }}
        />
      </label>
      <input
        type="file"
        id="file"
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleImageChange}
      />
      <label htmlFor="file">
        <AddPhotoAlternateOutlinedIcon
          className="cursor-pointer text-gray-600 w-200 text-4xl"
          style={{ fontSize: 28 }}
        />
      </label>
      <div className="flex-1">
        <input
          type="text"
          className="w-full rounded-lg h-11 bg-white shadow px-4"
          placeholder="Type something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
        />
        {imagePreview && (
          <div className="absolute bottom-16 left-0 right-0 top-16 border-4 border-slate-400 border-dashed flex justify-center items-center bg-slate-200">
            {uploading && <img src={Loader} className="absolute w-20" />}
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: "50%", maxHeight: "80%" }}
            />
          </div>
        )}
      </div>
      <SendIcon
        className="cursor-pointer text-gray-600 w-200 text-4xl"
        style={{ fontSize: 28 }}
        onClick={handleSendClick}
      />
    </div>
  );
};

export default Input;
