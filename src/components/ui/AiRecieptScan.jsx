"use client";

import { ScanGivenReceipt } from "@/app/actions/AiActions";
import { Camera } from "lucide-react";
import { useRef } from "react";

let AiRecieptScan = ({ onscancomplete }) => {
  const inputRef = useRef(null);

  let handlechange = async (e) => {
    let file = e.target.files?.[0];
    if (!file) return;

    let res = await ScanGivenReceipt(file);
    if (onscancomplete) onscancomplete(res);
  };

  return (
    <div className="w-full">
      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handlechange}
      />

      {/* Button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 rounded-lg border-cardBorder bg-accentLight  px-4 py-3 text-sm font-medium text-primaryText hover:bg-accentDark transition-colors duration-200"
      >
        <Camera className="h-5 w-5" />
        Scan Receipt
      </button>

      <p className="mt-1 text-xs text-gray-500 text-center">
        Take a photo of your receipt
      </p>
    </div>
  );
};

export default AiRecieptScan;
