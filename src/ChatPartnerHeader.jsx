import { useContext, useState } from "react";
import { Avatar } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AuthContext } from "./context/AuthContext";

const ChatPartnerHeader = ({ user, clearMessages }) => {
  const { currentUser } = useContext(AuthContext);
  const [toggleMore, setToggleMore] = useState(false);

  const handleClearMessages = async () => {
    clearMessages();
    setToggleMore(false);
  };

  return (
    <div className="h-16 absolute inset-x-0 flex py-2 px-6 justify-between items-center bg-slate-100 border-b">
      <div className="flex items-center gap-3">
        {user.photoURL ? (
          <Avatar src={user.photoURL} imgProps={{ referrerPolicy: "no-referrer" }} />
        ) : (
          <Avatar>{user.displayName?.[0]}</Avatar>
        )}
        <h4 className="font-semibold">{user.displayName}</h4>
      </div>
      {/*<div className="flex items-center gap-8">
        <div>
          <div
            className={`cursor-pointer p-2 ${
              toggleMore ? "bg-slate-200" : ""
            } rounded-full`}
            onClick={() => setToggleMore(!toggleMore)}
            onBlur={() => setToggleMore(!toggleMore)}
            tabIndex={0}
          >
            <MoreVertIcon className="text-gray-600" />
          </div>
          {toggleMore && (
            <div className="absolute top-14 right-4 w-48 bg-white py-2 rounded shadow border z-10">
              <div
                className="cursor-pointer hover:bg-slate-100 py-2 px-5 text-slate-700 flex gap-2 items-center"
                onClick={handleClearMessages}
              >
                Clear messages
              </div>
            </div>
          )}
        </div>
      </div>*/}
    </div>
  );
};

export default ChatPartnerHeader;
