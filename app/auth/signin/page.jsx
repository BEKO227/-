"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react"; // Install lucide-react if not installed

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- new state
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Successfully signed in!");
      window.location.href = "/";
    } catch (err) {
      console.log("❌ Login error:", err.message);
      setError("Invalid email or password.");
    }
  };

  const handleResetPassword = async () => {
    if (!email) return toast.error("Enter your email to reset password!");

    try {
      await sendPasswordResetEmail(auth, email, {
        url: "https://qamar-scarves.vercel.app/auth/signin",
        handleCodeInApp: true
      });
      toast.success("Password reset email sent! Check your inbox.");
    } catch (err) {
      console.log("❌ Reset error:", err.message);
      setError("Failed to send reset email. Make sure the email exists.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7]">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md border border-amber-200">
        <div className="flex justify-center mb-6">
          <Image src="/lgo.jpg" alt="Qamar Scarves" width={80} height={80} className="rounded-full" />
        </div>

        <h1 className="text-3xl font-bold text-amber-800 text-center mb-6">Sign In</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border border-amber-300 rounded-xl p-4 w-full text-lg"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // toggle type
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="border border-amber-300 rounded-xl p-4 w-full text-lg pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="bg-amber-700 hover:bg-amber-800 text-white font-semibold w-full py-4 rounded-xl text-lg mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="text-right mt-2 text-sm">
          <button
            onClick={handleResetPassword}
            className="text-amber-700 hover:text-amber-800 font-semibold"
          >
            Forgot Password?
          </button>
        </p>

        <p className="text-center text-gray-600 mt-4 text-sm">
          Don't have an account?{" "}
          <a href="/auth/signup" className="text-amber-700 hover:text-amber-800 font-semibold">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
