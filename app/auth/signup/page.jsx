"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import Image from "next/image";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import zxcvbn from "zxcvbn"; // Install: npm install zxcvbn

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  phone: z.string().min(7),
  age: z.number().int().min(1).max(120),
  gender: z.enum(["male", "female"]),
});

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data) => {
    try {
      const usersRef = collection(db, "users");

      // Check for duplicate email
      const emailQuery = query(usersRef, where("email", "==", data.email));
      const emailSnap = await getDocs(emailQuery);
      if (!emailSnap.empty) {
        toast.error("Email already exists");
        return;
      }

      // Check for duplicate phone
      const phoneQuery = query(usersRef, where("phone", "==", data.phone));
      const phoneSnap = await getDocs(phoneQuery);
      if (!phoneSnap.empty) {
        toast.error("Phone already exists");
        return;
      }

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const uid = userCredential.user.uid;

      // Store user info in Firestore
      await setDoc(doc(db, "users", uid), {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        age: data.age,
        gender: data.gender,
        location: "",
        avgSpent: 0,
        productsBoughtCount: 0,
        couponsUsedCount: 0,
        purchasesWithoutSale: 0,
        createdAt: new Date().toISOString(),
      });

      toast.success("Account created! You can now sign in.");
      window.location.href = "/auth/signin";
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setValue("password", value); // Update react-hook-form
    const result = zxcvbn(value);
    setPasswordScore(result.score);
  };

  const getPasswordStrength = (score) => {
    switch (score) {
      case 0:
        return { text: "Very Weak", color: "bg-red-500" };
      case 1:
        return { text: "Weak", color: "bg-orange-500" };
      case 2:
        return { text: "Medium", color: "bg-yellow-400" };
      case 3:
        return { text: "Strong", color: "bg-emerald-500" };
      case 4:
        return { text: "Very Strong", color: "bg-green-600" };
      default:
        return { text: "", color: "" };
    }
  };

  const strength = getPasswordStrength(passwordScore);
  const ageOptions = Array.from({ length: 120 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7]">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md border border-amber-200">
        <div className="flex justify-center mb-6">
          <Image src="/circle_logo.png" alt="Qamar Scarves" width={80} height={80} className="rounded-full" />
        </div>
        <h1 className="text-3xl font-bold text-amber-800 text-center mb-6">Create Account</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                {...register("firstName")}
                placeholder="First Name"
                className="border border-amber-300 rounded-xl p-4 w-full text-lg"
              />
              {errors.firstName && <span className="text-red-500">{errors.firstName.message}</span>}
            </div>

            <div className="flex-1">
              <input
                {...register("lastName")}
                placeholder="Last Name"
                className="border border-amber-300 rounded-xl p-4 w-full text-lg"
              />
              {errors.lastName && <span className="text-red-500">{errors.lastName.message}</span>}
            </div>
          </div>

          <input
            {...register("email")}
            placeholder="Email"
            className="border border-amber-300 rounded-xl p-4 w-full text-lg"
          />
          {errors.email && <span className="text-red-500">{errors.email.message}</span>}

          <input
            {...register("phone")}
            placeholder="Phone"
            className="border border-amber-300 rounded-xl p-4 w-full text-lg"
          />
          {errors.phone && <span className="text-red-500">{errors.phone.message}</span>}

          <select {...register("age", { valueAsNumber: true })} className="border border-amber-300 rounded-xl p-4 w-full text-lg">
            {ageOptions.map((age) => (
              <option key={age} value={age}>{age}</option>
            ))}
          </select>
          {errors.age && <span className="text-red-500">{errors.age.message}</span>}

          <select {...register("gender")} className="border border-amber-300 rounded-xl p-4 w-full text-lg">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {/* Password input with strength indicator */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              onChange={handlePasswordChange}
              placeholder="Password"
              className="border border-amber-300 rounded-xl p-4 w-full text-lg pr-12 focus:ring-2 focus:ring-amber-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {passwordScore > 0 && (
              <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-2 ${strength.color} rounded-full`}
                  style={{ width: `${(passwordScore + 1) * 20}%` }}
                ></div>
              </div>
            )}
            {passwordScore > 0 && (
              <p className={`text-sm mt-1 font-semibold ${strength.color}`}>{strength.text}</p>
            )}
          </div>
          {errors.password && <span className="text-red-500">{errors.password.message}</span>}

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-full text-lg font-semibold text-white transition-all duration-300 shadow bg-linear-to-r from-amber-700 to-amber-900 hover:opacity-90 mt-2"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4 text-sm">
          Already have an account?{" "}
          <a href="/auth/signin" className="text-amber-700 hover:text-amber-800 font-semibold">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
