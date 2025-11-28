"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, User, LogOut } from "lucide-react";
import { useAuth } from "../AuthContext";
import { useCart } from "../CartContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const { user, logout } = useAuth();
  const { cart } = useCart();

  const totalCartItems = cart?.length || 0;

  // Fetch user name from Firestore
  useEffect(() => {
    const fetchName = async () => {
      if (!user?.uid) return;
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUserName(snap.data().name || "");
        }
      } catch (error) {
        console.log("Error fetching user name:", error);
      }
    };

    fetchName();
  }, [user]);

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* LOGO LEFT */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            width={40}
            height={40}
            alt="Logo"
            className="object-contain"
          />
          <span className="text-xl font-semibold tracking-wide">
            Qamar Scarves
          </span>
        </Link>

        {/* CENTER LINKS */}
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-gray-700 transition">Home</Link>
          <Link href="/NewArrvial" className="hover:text-gray-700 transition">New Arrival</Link>
          <Link href="/topsellers" className="hover:text-gray-700 transition">Top Sellers</Link>
          <Link href="/AllScarfs" className="hover:text-gray-700 transition">All Scarfs</Link>
          <Link href="#footer" className="hover:text-gray-700 transition">Contact</Link>
        </div>

        {/* RIGHT SIDE ITEMS */}
        <div className="flex items-center gap-4">

          {/* Clickable Username (Profile Page) */}
          {user && (
            <Link 
              href="/user"
              className="hidden md:block text-sm text-gray-700 hover:text-black"
            >
              Welcome, <span className="font-semibold underline">{userName}</span>
            </Link>
          )}

          {/* CART ICON (hidden if NOT logged in) */}
          {user && (
            <Link href="/Cart" className="relative">
              <ShoppingBag className="w-6 h-6 hover:text-gray-700 cursor-pointer" />
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {totalCartItems}
                </span>
              )}
            </Link>
          )}

          {/* LOGIN / LOGOUT BUTTON */}
          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-black"
            >
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <Link href="/auth/signin" className="flex items-center gap-1 text-sm">
              <User className="w-6 h-6 hover:text-gray-700 cursor-pointer" />
              Login
            </Link>
          )}

          {/* MOBILE TOGGLE */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="flex flex-col px-6 py-4 gap-4 text-sm font-medium">

            {/* MOBILE USERNAME */}
            {user && (
              <Link 
                href="/user"
                onClick={() => setOpen(false)}
                className="text-gray-700 mb-2 underline"
              >
                Welcome, <span className="font-semibold">{userName}</span>
              </Link>
            )}

            <Link href="/" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/NewArrvial" onClick={() => setOpen(false)}>New Arrival</Link>
            <Link href="/topsellers" onClick={() => setOpen(false)}>Top Sellers</Link>
            <Link href="/AllScarfs" onClick={() => setOpen(false)}>All Scarfs</Link>
            <Link href="#footer" onClick={() => setOpen(false)}>Contact</Link>

            {/* MOBILE CART */}
            {user && (
              <Link href="/Cart" onClick={() => setOpen(false)}>
                Cart ({totalCartItems})
              </Link>
            )}

            {/* MOBILE LOGIN / LOGOUT */}
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="text-left text-red-600"
              >
                Logout
              </button>
            ) : (
              <Link href="/auth/signin" onClick={() => setOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
