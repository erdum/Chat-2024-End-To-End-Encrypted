import React, { useState, useContext } from "react";
import CurrentUserHeader from "./CurrentUserHeader";
import Search from "./Search";
import Users from "./Users";
import { MessagesContext } from "./context/MessagesContext";

const Sidebar = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const { setSelectedUser, selectedUser, users } = useContext(MessagesContext);

  const sortedUsers = [...users].sort((a, b) => {
    return a.displayName.localeCompare(b.displayName);
  });

  const filteredUsers = sortedUsers.filter((user) =>
    user.displayName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setSearchKeyword("");
  };

  return (
    <div className="border-e h-full flex flex-col">
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
