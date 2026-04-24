'use client';

import React, { useState, useEffect } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";

interface OTPVerificationProps {
  phoneNumber: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  isVerifying: boolean;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ 
  phoneNumber, 
  onVerify, 
  onResend, 
  isVerifying 
}) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleResend = () => {
    setOtp("");
    setTimer(30);
    setCanResend(false);
    onResend();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    onVerify(otp);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-slate-900 uppercase tracking-wider">Verify your Mobile Number</h3>
        <p className="text-slate-500 text-sm">
          We've sent a 6-digit verification code to <span className="font-semibold text-slate-900">+91 {phoneNumber}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(val) => setOtp(val)}
          className="gap-2"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} className="w-12 h-14 text-xl font-bold border-2 rounded-lg" />
            <InputOTPSlot index={1} className="w-12 h-14 text-xl font-bold border-2 rounded-lg" />
            <InputOTPSlot index={2} className="w-12 h-14 text-xl font-bold border-2 rounded-lg" />
            <InputOTPSlot index={3} className="w-12 h-14 text-xl font-bold border-2 rounded-lg" />
            <InputOTPSlot index={4} className="w-12 h-14 text-xl font-bold border-2 rounded-lg" />
            <InputOTPSlot index={5} className="w-12 h-14 text-xl font-bold border-2 rounded-lg" />
          </InputOTPGroup>
        </InputOTP>

        <div className="text-center">
          <Button 
            type="submit" 
            disabled={isVerifying || otp.length < 6}
            className="w-full min-w-[200px] h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-95"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Continue"
            )}
          </Button>
        </div>

        <div className="text-center pt-2">
          {canResend ? (
            <button 
              type="button" 
              onClick={handleResend}
              className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Resend OTP
            </button>
          ) : (
            <p className="text-slate-400 text-sm font-medium">
              Resend OTP in <span className="text-slate-600">{timer}s</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default OTPVerification;
