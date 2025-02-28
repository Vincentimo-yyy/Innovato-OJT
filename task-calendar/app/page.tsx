import React from "react";

import BorderBox from "../components/borderbox";
import Header from "../components/header";

import BorderlessBox from "@/components/time-table";
import InputBar from "@/components/inputbar";

export default function LandingPage() {
  return (
    <div>
      <Header />
      <div className="flex pt-6 w-full pr-5">
        <div className="flex flex-col">
          <BorderBox />
          <div className="pt-4 pl-6">
            <InputBar />
          </div>
        </div>
        <BorderlessBox />
      </div>
    </div>
  );
}
