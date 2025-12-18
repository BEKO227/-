"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, User, LogOut } from "lucide-react";
import { useAuth } from "../AuthContext";
import { useCart } from "../CartContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useLanguage } from "../LanguageContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const { user, logout } = useAuth();
  const { cart } = useCart();
  const totalCartItems = cart?.length || 0;

  // Language
  const { lang, toggleLang } = useLanguage();

  // Translations
  const translations = {
    en: {
      newArrival: "New Arrival",
      topSellers: "Top Sellers",
      bundles: "Bundles",
      allScarfs: "All Scarves",
      contact: "Contact",
      about: "About Us",
      login: "Login",
      logout: "Logout",
      welcome: "Welcome",
      cart: "Cart",
      switch: "العربية",
      logo: "Qamar Scarves",
    },
    ar: {
      newArrival: "وصل حديثًا",
      topSellers: "الأكثر مبيعًا",
      bundles: "الباقات",
      allScarfs: "كل الأوشحة",
      contact: "اتصل بنا",
      about: "من نحن",
      login: "تسجيل الدخول",
      logout: "تسجيل الخروج",
      welcome: "مرحبًا",
      cart: "السلة",
      switch: "English",
      logo: "أوشحة قمر",
    },
  };

  const t = translations[lang];

  // Fetch user name
  useEffect(() => {
    const fetchName = async () => {
      if (!user?.uid) return;
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setUserName((data.firstName || "") + " " + (data.lastName || ""));
        }
      } catch (error) {
        console.log("Error fetching user name:", error);
      }
    };
    fetchName();
  }, [user]);

  const navLinks = [
    { href: "/NewArrvial", label: t.newArrival },
    { href: "/topsellers", label: t.topSellers },
    { href: "/Bundles", label: t.bundles },
    { href: "/AllScarfs", label: t.allScarfs },
    { href: "/AboutUs", label: t.about },
    { href: "#footer", label: t.contact },
  ];

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/circle_logo.png" width={40} height={40} alt="Logo" className="object-contain" />
          <span
            className="text-xl font-semibold tracking-wide text-amber-700"
            style={{ fontFamily: "'Diwani Letter', sans-serif" }}
          >
            {t.logo}
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-8 text-sm font-medium">
          {navLinks.map((link, i) => (
            <Link key={i} href={link.href} className="hover:text-gray-700 transition font-medium">
              {link.label}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
          >
            {t.switch}
          </button>

          {/* User Greeting */}
          {user && (
            <Link href="/user" className="hidden md:block text-sm text-gray-700 hover:text-black">
              {t.welcome}, <span className="font-semibold underline">{userName}</span>
            </Link>
          )}

          {/* Cart */}
          {user && (
            <Link href="/Cart" className="relative">
              <ShoppingBag className="w-6 h-6 hover:text-gray-700 cursor-pointer" />
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                  {totalCartItems}
                </span>
              )}
            </Link>
          )}

          {/* Login / Logout */}
          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-black"
            >
              <LogOut className="w-5 h-5" />
              {t.logout}
            </button>
          ) : (
            <Link href="/auth/signin" className="flex items-center gap-1 text-sm">
              <User className="w-6 h-6 hover:text-gray-700 cursor-pointer" />
              {t.login}
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-sm animate-slideDown">
          <div className="flex flex-col px-6 py-4 gap-4 text-sm font-medium">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="px-3 py-1 border rounded text-sm w-max"
            >
              {t.switch}
            </button>

            {/* User Greeting */}
            {user && (
              <Link href="/user" onClick={() => setOpen(false)} className="text-gray-700 mb-2 underline">
                {t.welcome}, {userName}
              </Link>
            )}

            {/* Navigation Links */}
            {navLinks.map((link, i) => (
              <Link key={i} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}

            {/* Cart */}
            {user && (
              <Link href="/Cart" onClick={() => setOpen(false)}>
                {t.cart} ({totalCartItems})
              </Link>
            )}

            {/* Login / Logout */}
            {user ? (
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="text-left text-red-600"
              >
                {t.logout}
              </button>
            ) : (
              <Link href="/auth/signin" onClick={() => setOpen(false)}>
                {t.login}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
