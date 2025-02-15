import React, { useState } from "react";
import Layout from "../layouts/Layout";
import ProfileContent from "../tabs/ProfileContent";
import AdminContent from "../tabs/AdminContent";
import ChatContent from "../tabs/ChatContent";
import MessagesContent from "../tabs/MessagesContent";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("profile");

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === "profile" && <ProfileContent />}
      {activeTab === "admin" && <AdminContent />}
      {activeTab === "chat" && <ChatContent />}
      {activeTab === "messagerie" && <MessagesContent />}
    </Layout>
  );
};

export default Profile;
