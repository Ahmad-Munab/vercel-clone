import Footer from "@/components/footer";
import Navabar from "@/components/navbar";
import React from "react";

const LandingLayout = ({ children }) => {
  return (
    <main className=" bg-background p-0 m-0 h-full w-full flex flex-col overflow-x-hidden">
      <Navabar />
      {children}
      <Footer />
    </main>
  );
};

export default LandingLayout;
