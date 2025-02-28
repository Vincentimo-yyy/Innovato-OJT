import React from "react";

import BorderBox from "../components/borderbox";
import Header from "../components/header";

import BorderlessBox from "@/components/borderlessBox";

const LandingPage: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="flex pt-6 w-full">
        <BorderBox />
        <BorderlessBox />
      </div>
    </div>
  );
};

export default LandingPage;
