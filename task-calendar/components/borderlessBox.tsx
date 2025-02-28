"use client";
import React from "react";
import { Card, CardBody } from "@heroui/card";

export default function BorderlessBox() {
  return (
    <div className="flex-1 pr-6">
      <Card className="h-[580px] shadow-md bg-white">
        <CardBody>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-100   flex justify-center items-center">
              <p className="text-gray-700 font-semibold">Column 1</p>
            </div>
            <div className="p-4 bg-gray-200   flex justify-center items-center">
              <p className="text-gray-700 font-semibold">Column 2</p>
            </div>
            <div className="p-4 bg-gray-300   flex justify-center items-center">
              <p className="text-gray-700 font-semibold">Column 3</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
