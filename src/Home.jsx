import { useState, useEffect } from "react";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [touchEndY, setTouchEndY] = useState(null);
  const [sidebarOffset, setSidebarOffset] = useState(window.innerWidth * 0.8);

  const swipeThreshold = 10;
  const swipeEffectSpeed = 15;

  const onTouchStart = (e) => {
    const touchStartPositionX = e.nativeEvent.touches[0].pageX;
    const touchStartPositionY = e.nativeEvent.touches[0].pageY;
    setTouchStartX(touchStartPositionX);
    setTouchStartY(touchStartPositionY);
    setTouchEndX(null);
    setTouchEndY(null);
  };

  const onTouchMove = (e) => {
    const currentTouchX = e.nativeEvent.touches[0].pageX;
    const currentTouchY = e.nativeEvent.touches[0].pageY;
    const swipeDistanceX = touchStartX - currentTouchX;
    const swipeDistanceY = touchStartY - currentTouchY;

    const isLeft = swipeDistanceX > swipeThreshold;
    const isRight = swipeDistanceX < -swipeThreshold;

    if (isLeft && Math.abs(swipeDistanceX) > swipeDistanceY) {
      setSidebarOffset(prevValue => (prevValue - swipeEffectSpeed));
      setTouchStartX(currentTouchX);
      setTouchStartY(currentTouchY);
    }

    if (isRight && Math.abs(swipeDistanceX) > swipeDistanceY) {

      if (sidebarOffset < (window.innerWidth * 0.8)) {
        setSidebarOffset(prevValue => (prevValue + swipeEffectSpeed));
        setTouchStartX(currentTouchX);
        setTouchStartY(currentTouchY);
      }
    }
  }

  const onTouchEnd = (e) => {

    if (!(touchStartX || touchEndX)) return;

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
        className={`absolute top-0 w-[80%] h-screen bg-white z-10 transition-all ease-in duration-200 overflow-x-hidden lg:hidden`}
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
