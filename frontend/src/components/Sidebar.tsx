import React from "react";

const Sidebar: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void; }> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="nav flex-column nav-pills bg-light p-3 rounded shadow">
      {['profile', 'admin', 'chat', 'messagerie'].map(tab => (
        <button 
          key={tab} 
          className={`nav-link fw-bold ${activeTab === tab ? 'text-white' : 'text-dark'}`} 
          onClick={() => setActiveTab(tab)}
          style={{
            borderRadius: '10px',
            marginBottom: '5px',
            backgroundColor: activeTab === tab ? '#e91e63' : '#f8f9fa',
            border: 'none'
          }}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </nav>
  );
};

export default Sidebar;
