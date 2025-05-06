import React from "react";
import TEAChecker from "../components/TEAChecker";

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">EB-5 TEA Mapping Tool</h1>
      <TEAChecker />
    </div>
  );
}
