import React, { memo } from "react";
import Header from "../../components/ui/Header";
import Navbar from "../../components/ui/Navbar";
import Footer from "../../components/ui/Footer";
import DashboardLayout from "../../layouts/DashboardLayout";

const Home = memo(() => {
  return (
    <>
      <Header />
      <Navbar />
      <div className="flex h-[calc(100vh-146px)] flex-col overflow-hidden">
        <DashboardLayout />
      </div>
      <Footer />
    </>
  );
});

Home.displayName = 'Home';

export default Home;
