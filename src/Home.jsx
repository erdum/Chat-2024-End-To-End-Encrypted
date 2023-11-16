import { useState, useEffect } from "react";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [sidebarOffset, setSidebarOffset] = useState(window.innerWidth * 0.8);

  const swipeOpenThreshold = 40;
  const swipeEffectSpeed = 8;

  const onTouchStart = (e) => {
    const touchStartPosition = e.nativeEvent.touches[0].pageX;

    if (sidebarOffset == 0 && touchStartPosition < swipeOpenThreshold) {
      setTouchStart(touchStartPosition);
    } else if (sidebarOffset == (window.innerWidth * 0.8)) {
      setTouchStart(touchStartPosition);
    } else {
      setTouchStart(null);
    }
  };

  const onTouchMove = (e) => {
    const currentTouch = e.nativeEvent.touches[0].pageX;
    const swipeDistance = touchStart - currentTouch;

    if (
      !touchStart
      || currentTouch >= (window.innerWidth * 0.8)
    ) return;

    if (
      sidebarOffset == (window.innerWidth * 0.8)
      && swipeDistance <= 0
    ) return;

    if (swipeDistance < 10 && sidebarOffset < (window.innerWidth * 0.8)) {
      setSidebarOffset(prevValue => (prevValue + swipeEffectSpeed));
    } else {
      setSidebarOffset(prevValue => (prevValue - swipeEffectSpeed));
    }
  }

  const onTouchEnd = (e) => {

    // Snap sidebar when user releases the sidebar
    if (sidebarOffset > (window.innerWidth / 3)) {
      setSidebarOffset(window.innerWidth * 0.8);
    } else if (sidebarOffset < (window.innerWidth / 3)) {
      setSidebarOffset(0);
    }
  }

  useEffect(() => console.log(sidebarOffset), [sidebarOffset]);

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
