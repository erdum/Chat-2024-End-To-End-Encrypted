import { useState, useEffect } from "react";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [sidebarOffset, setSidebarOffset] = useState(window.innerWidth * 0.8);

  const swipeThreshold = 50;
  const siwpeEndDamping = 20;
  const leftToRight = (touchEnd - touchStart) > swipeThreshold;
  const rightToLeft = (touchStart - touchEnd) > swipeThreshold;

  const onTouchStart = (e) => setTouchStart(e.nativeEvent.touches[0].pageX);
  const onTouchMove = (e) => {
    const currentTouch = e.nativeEvent.touches[0].pageX;

    if (leftToRight) {

      if (
        currentTouch > sidebarOffset &&
        currentTouch < (window.innerWidth * 0.8) + siwpeEndDamping
      ) {
        setSidebarOffset(currentTouch);
      }
    } else if (rightToLeft) {

      if (sidebarOffset >= window.innerWidth * 0.8 || sidebarOffset > 0) {
        setSidebarOffset(currentTouch);
      }
    }
    setTouchEnd(currentTouch);
  }

  const onTouchEnd = (e) => {
    const width = window.innerWidth;

    if (!(leftToRight || rightToLeft)) return;

    if (touchEnd > (width / 3)) {
      setSidebarOffset(width * 0.8);
    } else {
      setSidebarOffset(0);
    }
  }

  useEffect(() => {

    if (!selectedUser) {
      setSidebarOffset(window.innerWidth * 0.8);
    } else {
      setSidebarOffset(0);
    }
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
      <div
        className={`absolute top-0 w-[80%] h-screen bg-white z-10 transition-all overflow-x-hidden lg:hidden`}
        style={{
          left: `calc(-80% + ${sidebarOffset}px)`
        }}
      >
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
