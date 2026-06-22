"use client";

import { useState, useTransition } from "react";
import { ChevronRight, ShieldCheck, KeyRound, ArrowLeft, Loader2 } from "lucide-react";
import { triggerCamsRequest, verifyOtpAndFetch } from "@/app/actions/triggerCamsRequest";

export default function ConnectGroww() {
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1); // Step 1: Email/PAN, Step 2: OTP Verification
  const [email, setEmail] = useState("");
  const [pan, setPan] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState(null);

  // Phase 1: Handle Validation & Open CAMS Portal Safely
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    startTransition(async () => {
      const result = await triggerCamsRequest(email, pan);
      
      if (result.success) {
        // 🚀 THE VERCEL FIX: Open the official free CAMS portal in a new tab.
        // This forces the request through the user's browser IP, completely bypassing firewalls.
        window.open(
          "https://www.camsonline.com/Investors/Statements/Consolidated-Account-Statement", 
          "_blank"
        );

        // Instantly switch the user interface view to the OTP entry sequence
        setStep(2); 
      } else {
        setErrorMsg(result.error);
      }
    });
  };

  // Phase 2: Handle OTP Handshake & Scrape Processing
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    
    const formData = new FormData(e.currentTarget);
    formData.append("email", email);
    formData.append("pan", pan);

    startTransition(async () => {
      const result = await verifyOtpAndFetch(formData);
      if (result.success) {
        setSuccessData(result.data);
        setStep(3); // Navigate to completion overview screen
      } else {
        setErrorMsg(result.error);
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#0a0a0a] border border-neutral-800 p-6 rounded-2xl shadow-2xl transition-all duration-300">
      
      {/* HEADER SECTION */}
      {step !== 3 && (
        <div className="flex items-center gap-3 mb-6 border-b border-neutral-900 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-500 text-lg shadow-inner">
            G
          </div>
          <div>
            <h3 className="text-white font-bold text-sm tracking-tight">Sync Groww Portfolio</h3>
            <p className="text-[11px] text-neutral-400">Automated ledger ingestion via secure CAMS pipeline</p>
          </div>
        </div>
      )}

      {/* STEP 1: INITIAL DETAILS INPUT */}
      {step === 1 && (
        <form onSubmit={handleInitialSubmit} className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Registered Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com" 
              className="bg-neutral-900 border border-neutral-800 focus:border-neutral-700 rounded-xl p-3 text-sm text-white focus:outline-none transition-colors w-full"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">PAN Number</label>
            <input 
              type="text" 
              required 
              maxLength={10}
              value={pan}
              // 🛠️ CRITICAL CASE FIX: Explicitly enforce uppercase inputs for correct decryption execution
              onChange={(e) => setPan(e.target.value.toUpperCase())}
              placeholder="ABCDE1234F" 
              className="bg-neutral-900 border border-neutral-800 focus:border-neutral-700 rounded-xl p-3 text-sm text-white focus:outline-none transition-colors w-full font-mono uppercase tracking-widest"
            />
          </div>

          {/* Privacy Note to Build User Trust */}
          <div className="bg-neutral-950 border border-neutral-900 p-3 rounded-xl flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-neutral-500 leading-normal">
              Your PAN card input is strictly applied as a local cryptographic key block to decrypt the incoming CAMS statement PDF file. We do not store or persist raw records.
            </p>
          </div>

          {errorMsg && <p className="text-xs text-red-500 font-medium">{errorMsg}</p>}

          <button 
            type="submit" 
            disabled={isPending} 
            className="w-full bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-semibold p-3 text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-white/5 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Initializing Handshake...
              </>
            ) : (
              <>
                Open Official CAMS Portal & Generate Token <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* STEP 2: OTP INTERCEPT SCREEN */}
      {step === 2 && (
        <form onSubmit={handleOtpVerify} className="space-y-4 animate-in slide-in-from-right-4 duration-200">
          <button 
            type="button" 
            onClick={() => setStep(1)} 
            className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="w-3 h-3" /> Back to details
          </button>

          <div className="bg-neutral-950 border border-neutral-900 p-3 rounded-xl flex items-start gap-3">
            <KeyRound className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-xs font-semibold text-neutral-200">Verify OTP in Opened Tab</p>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-normal">
                CAMS has loaded a new tab. Submit your details there, get the OTP from your phone/email, type it into the CAMS page, then enter that code here to authorize our background parser sync.
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider text-center">Enter 6-Digit OTP Code</label>
            <input 
              type="text" 
              name="otp"
              maxLength={6}
              required 
              placeholder="000000" 
              className="bg-neutral-900 border border-neutral-800 focus:border-neutral-700 rounded-xl p-3 text-center text-xl font-mono font-bold tracking-[0.5em] text-white focus:outline-none transition-colors w-full"
            />
          </div>

          {errorMsg && <p className="text-xs text-red-500 font-medium">{errorMsg}</p>}

          <button 
            type="submit" 
            disabled={isPending} 
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-neutral-800 text-white font-semibold p-3 text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Intercepting & Decrypting Document...
              </>
            ) : (
              "Verify OTP & Auto Import Assets"
            )}
          </button>
        </form>
      )}

      {/* STEP 3: SUCCESS OVERVIEW SCREEN */}
      {step === 3 && successData && (
        <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-500/5 animate-bounce">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Portfolio Successfully Synced!</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Your bento grid valuation charts have been mapped securely.
            </p>
          </div>

          {/* Dynamic Balance Display Box */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-4 text-left space-y-2">
            <div className="flex justify-between items-center text-xs border-b border-neutral-900 pb-2">
              <span className="text-neutral-400">Total Asset Net Worth</span>
              <span className="text-emerald-400 font-bold font-mono">₹{successData.totalNetWorth.toLocaleString("en-IN")}</span>
            </div>
            <div className="space-y-1.5 pt-1">
              {successData.holdings.map((stock, i) => (
                <div key={i} className="flex justify-between items-center text-[11px]">
                  <span className="text-neutral-300 truncate max-w-[240px]">{stock.name}</span>
                  <span className="text-white font-mono">₹{stock.balanceVal.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setStep(1)} 
            className="text-xs text-neutral-500 hover:text-white transition-colors underline decoration-dotted cursor-pointer"
          >
            Sync another account
          </button>
        </div>
      )}
    </div>
  );
}