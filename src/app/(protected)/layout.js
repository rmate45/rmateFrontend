import Header from "@/components/shared/Header/Header";
import Sidebar from "@/components/shared/SideBar/SideBar";
import React from "react";

const layout = ({ children }) => {

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default layout;
