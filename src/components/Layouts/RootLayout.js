import React from "react";

export default function RootLayout({ children }) {
  return (
    <div className="bg-light w-100 p-4 min-vh-100">
      {children}
    </div>
  );
}
