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

  const { lang, toggleLang } = useLanguage();

  const translations = {
    en: {
        // newArrival: "New Arrival",
        // topSellers: "Top Sellers",
        // bundles: "Bundles",
        // allScarfs: "All Scarves",
        // contact: "Contact",
        // about: "About Us",
        // login: "Login",
      logout: "Logout",
      welcome: "Welcome",
      cart: "Cart",
      switch: "العربية",
      logo: "Qamar Scarves",
    },
    ar: {
      // newArrival: "وصل حديثًا",
      // topSellers: "الأكثر مبيعًا",
      // bundles: "الباقات",
      // allScarfs: "كل الأوشحة",
      // contact: "اتصل بنا",
      // about: "من نحن",
      // login: "تسجيل الدخول",
      // logout: "تسجيل الخروج",
      welcome: "مرحبًا",
      cart: "السلة",
      switch: "English",
      logo: "أوشحة قمر",
    },
  };

  const t = translations[lang];

  useEffect(() => {
    const fetchName = async () => {
      if (!user?.uid) return;
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setUserName(`${data.firstName || ""} ${data.lastName || ""}`.trim());
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
    <nav className="w-full sticky top-0 z-50 bg-linear-to-r from-amber-50 via-white to-amber-50 shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/circle_logo.png"
            width={45}
            height={45}
            alt="Logo"
            className="rounded-full border border-amber-200 shadow-sm"
          />
          <span
            className="text-xl font-bold text-amber-800 tracking-wide"
            style={{ fontFamily: "'Diwani Letter', sans-serif" }}
          >
            {t.logo}
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="relative px-2 py-1 rounded-lg hover:text-white hover:bg-amber-700 transition-all duration-300"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-700 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="px-3 py-1 border border-amber-300 rounded-lg text-sm font-medium text-amber-800 hover:bg-amber-700 hover:text-white transition"
          >
            {t.switch}
          </button>

          {/* User Greeting */}
          {user && (
            <Link
              href="/user"
              className="hidden md:block text-sm text-amber-900 font-medium hover:underline"
            >
              {t.welcome}, <span className="font-semibold">{userName}</span>
            </Link>
          )}

          {/* Cart */}
          {user && (
            <Link href="/Cart" className="relative">
              <ShoppingBag className="w-6 h-6 text-amber-800 hover:text-amber-700 transition" />
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse shadow">
                  {totalCartItems}
                </span>
              )}
            </Link>
          )}

          {/* Login / Logout */}
          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-1 text-sm text-amber-800 font-medium hover:text-amber-700 transition"
            >
              <LogOut className="w-5 h-5" />
              {t.logout}
            </button>
          ) : (
            <Link
              href="/auth/signin"
              className="flex items-center gap-1 text-sm font-medium text-amber-800 hover:text-amber-700 transition"
            >
              <User className="w-6 h-6" />
              {t.login}
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 rounded hover:bg-amber-100" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6 text-amber-800" /> : <Menu className="w-6 h-6 text-amber-800" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-lg animate-slideDown p-6 flex flex-col gap-4 text-sm font-medium">
          <button
            onClick={toggleLang}
            className="px-3 py-1 border rounded-lg w-max text-amber-800 hover:bg-amber-700 hover:text-white transition"
          >
            {t.switch}
          </button>

          {user && (
            <Link href="/user" onClick={() => setOpen(false)} className="text-amber-900 font-medium underline">
              {t.welcome}, {userName}
            </Link>
          )}

          {navLinks.map((link, i) => (
            <Link key={i} href={link.href} onClick={() => setOpen(false)} className="hover:text-amber-700 transition">
              {link.label}
            </Link>
          ))}

          {user && (
            <Link href="/Cart" onClick={() => setOpen(false)} className="hover:text-amber-700 transition">
              {t.cart} ({totalCartItems})
            </Link>
          )}

          {user ? (
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="text-red-600 font-medium"
            >
              {t.logout}
            </button>
          ) : (
            <Link href="/auth/signin" onClick={() => setOpen(false)} className="text-amber-800 font-medium hover:text-amber-700 transition">
              {t.login}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
