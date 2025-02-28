"use client";
import React from "react";
import { Card, CardBody } from "@heroui/react";

export default function BorderBox() {
  return (
    <div className="pr-6 pl-6">
      <Card className="w-64 border-2 border-gray-300 rounded-lg shadow-md">
        <CardBody className="h-[500px]">
          <p className="text-center text-gray-700">Border Box</p>
        </CardBody>
      </Card>
    </div>
  );
}
