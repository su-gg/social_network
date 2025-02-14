import React from "react";
import Sidebar from "../components/Sidebar";

interface LayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children }) => {
  return (
    <div className="container-fluid mt-4">
      <h1 className="text-center" style={{ color: '#e91e63' }}> Beyonders </h1>
      <div className="row">
        <div className="col-md-3 d-flex flex-column" style={{ minHeight: '100vh' }}>
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="col-md-9">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
