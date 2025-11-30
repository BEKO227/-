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
  const {
    register,
    handleSubmit,
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
        location: "", // default empty
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

  const ageOptions = Array.from({ length: 120 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7]">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md border border-amber-200">
        <div className="flex justify-center mb-6">
          <Image src="/lgo.jpg" alt="Qamar Scarves" width={80} height={80} className="rounded-full"/>
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
        <input {...register("email")} placeholder="Email" className="border border-amber-300 rounded-xl p-4 w-full text-lg"/>
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}

        <input {...register("phone")} placeholder="Phone" className="border border-amber-300 rounded-xl p-4 w-full text-lg"/>
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

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
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
        {errors.password && <span className="text-red-500">{errors.password.message}</span>}

        <button type="submit" className="bg-amber-700 hover:bg-amber-800 text-white font-semibold w-full py-4 rounded-xl text-lg mt-2">Sign Up</button>
        </form>

        <p className="text-center text-gray-600 mt-4 text-sm">
          Already have an account? <a href="/auth/signin" className="text-amber-700 hover:text-amber-800 font-semibold">Sign In</a>
        </p>
      </div>
    </div>
  );
}
