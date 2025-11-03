// import { Check } from "lucide-react";
import React from "react";

export default function ActiveFeatures() {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center relative bg-[#fafafa]">
      <div className="flex flex-col justify-center items-center gap-3">
        <div className="bg-[#17B978] p-2 rounded-full shadow-lg">
          <div className="bg-white p-2 rounded-full shadow-lg">
            {/* <Check className="w-10 h-10 text-[#17B978] font-bolder" /> */}
          </div>
        </div>
        <p className="text-foreground lg:text-lg sm:text-sm leading-6">
          Internet Aktif
        </p>
      </div>

      <div
        className="fixed inset-x-2 bottom-2 max-w-md mx-auto flex flex-col justify-center items-center py-2 px-4 rounded-2xl gap-1 bg-white/75 backdrop-blur-md lg:bottom-4"
        style={{ WebkitBackdropFilter: "blur(12px)" }}
      >
        <p className="text-foreground text-xs text-center">
          Powered by Varnion
        </p>
      </div>
    </div>
  );
}
