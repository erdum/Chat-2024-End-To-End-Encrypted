import MainContent from "./MainContent";
import Sidebar from "./Sidebar";

const Home = () => {
  return (
    <div className="flex min-h-screen bg-slate-100 max-w-[1400px] min-w-[850px] mx-auto">
      <div className="bg-white lg:w-[400px] w-[300px]">
        <Sidebar />
      </div>
      <div className="bg-slate-300 flex-1">
        <MainContent />
      </div>
    </div>
  );
};

export default Home;
