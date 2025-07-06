import { useState, useContext } from "react";
import { SignalContext } from "../../context/SignalContext";
import CurrentUserHeader from "./CurrentUserHeader";
import Search from "../Search";
import Users from "../Users";
import { useStore } from "../../store";

const Sidebar = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const setSelectedUser = useStore((state) => state.setSelectedUser);
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
      />
    </div>
  );
};

export default Sidebar;
