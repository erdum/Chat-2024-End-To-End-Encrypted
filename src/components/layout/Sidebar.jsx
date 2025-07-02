import { useState, useContext } from "react";
import { SignalContext } from "../../context/SignalContext";
import CurrentUserHeader from "./CurrentUserHeader";
import Search from "../Search";
import Users from "../Users";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const { users } = useContext(SignalContext);

  const filteredUsers = users.filter((user) =>
    user.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setSearchKeyword("");
  };

  return (
    <div className="border-e h-full flex flex-col bg-white">
      <CurrentUserHeader />
      <Search
        searchKeyword={searchKeyword}
        onSearchChange={(value) => setSearchKeyword(value)}
      />
      <Users
        users={filteredUsers}
        onUserClick={handleUserClick}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default Sidebar;
