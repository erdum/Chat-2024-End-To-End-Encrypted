import { useState, useEffect } from "react";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true);

  const minSwipeDistance = 25;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.nativeEvent.touches[0].pageX);
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.nativeEvent.touches[0].pageX);
  }

  const onTouchEnd = () => {
    
    if (!touchStart || !touchEnd) return;
    
    if (touchStart <= 200 && touchEnd - touchStart > minSwipeDistance) {
      setIsMobileSidebarOpen(true);
    }

    if (touchStart - touchEnd > minSwipeDistance) {
      setIsMobileSidebarOpen(false);
    }
  }

  useEffect(() => {

    if (!selectedUser) return;
    setIsMobileSidebarOpen(false);
  }, [selectedUser]);

  return (
    <div
      className="flex min-h-screen bg-slate-100 w-full lg:max-w-[1400px] lg:min-w-[850px] mx-auto"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="bg-white hidden lg:block lg:w-[400px]">
        <Sidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>
      <div className={`absolute top-0 left-0 h-screen bg-white z-10 transition-all overflow-x-hidden ${isMobileSidebarOpen ? 'w-5/6' : 'w-0'} lg:hidden`}>
        <Sidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>
      <div className="bg-slate-300 flex-1">
        <MainContent
          selectedUser={selectedUser}
        />
      </div>
    </div>
  );
};

export default Home;
