import { useEffect } from "react";
import MainContent from "../components/MainContent";
import Sidebar from "../components/layout/Sidebar";
import Drawer from "react-motion-drawer";
import { useStore } from "../store";

const Home = () => {
  const selectedUser = useStore((state) => state.selectedUser);
  const isSidebarOpen = useStore((state) => state.isSidebarOpen);
  const setSidebarOpen = useStore((state) => state.setSidebarOpen);
  const setSidebarClose = useStore((state) => state.setSidebarClose);

  useEffect(() => {

    if (selectedUser == null) {
      setSidebarOpen();
    } else {
      setSidebarClose()
    }
  }, [selectedUser]);

  return (
    <div
      className="flex min-h-screen bg-slate-100 w-full lg:max-w-[1400px] lg:min-w-[850px] mx-auto"
    >
      <div className="bg-white hidden lg:block lg:w-[400px]">
        <Sidebar />
      </div>
      <div className="lg:hidden">
        <Drawer
          open={isSidebarOpen}
          peakingWidth={0}
          onChange={() => {

            if (!isSidebarOpen) setSidebarOpen();
          }}
          handleWidth={50}
        >
          <Sidebar />
        </Drawer>
      </div>
      <div className="bg-slate-300 flex-1">
        <MainContent />
      </div>
    </div>
  );
};

export default Home;
