"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function VerifyReset() {
  const [otp, setOtp] = useState("");
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  const handleVerify = () => {
    if (otp.length !== 6) return toast.error("Please enter a 6-digit code!");

    // Simulate OTP verification
    toast.success("OTP verified! Redirecting to reset password...");
    router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfaf7]">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md border border-amber-200 text-center">
        <h1 className="text-2xl font-bold text-amber-800 mb-6">Verify Code</h1>
        <p className="mb-4 text-gray-700">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>

        {/* OTP Input */}
        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <button
          onClick={handleVerify}
          className="mt-6 bg-amber-700 text-white py-3 px-6 rounded-xl hover:bg-amber-800 transition"
        >
          Verify Code
        </button>
      </div>
    </div>
  );
}
