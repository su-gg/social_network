import React, { useState } from "react";
import Layout from "../layouts/Layout";
import ProfileContent from "../tabs/ProfileContent";
import AdminContent from "../tabs/AdminContent";
import ChatContent from "../tabs/ChatContent";
import MessagesContent from "../tabs/MessagesContent";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("profil");

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === "profil" && <ProfileContent />}
      {activeTab === "admin" && <AdminContent />}
      {activeTab === "chat" && <ChatContent />}
      {activeTab === "messagerie" && <MessagesContent />}
    </Layout>
  );
};

export default Profile;
