"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import { confirmPasswordReset } from "firebase/auth";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode"); // from reset email link
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async () => {
    if (password !== confirmPassword) return toast.error("Passwords do not match!");
    if (password.length < 6) return toast.error("Password must be at least 6 characters.");

    try {
      await confirmPasswordReset(auth, oobCode, password);
      toast.success("Password successfully reset! You can now sign in.");
      window.location.href = "/auth/signin";
    } catch (err) {
      console.log(err);
      toast.error("Failed to reset password. The link may be invalid or expired.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7]">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md border border-amber-200 text-center">
        <h1 className="text-2xl font-bold text-amber-800 mb-6">Set New Password</h1>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-amber-300 rounded-xl p-4 w-full text-lg mb-4"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border border-amber-300 rounded-xl p-4 w-full text-lg mb-4"
        />
        <button
          onClick={handleReset}
          className="mt-2 bg-amber-700 text-white py-3 px-6 rounded-xl hover:bg-amber-800 transition w-full"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
