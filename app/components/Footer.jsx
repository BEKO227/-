"use client";

import React from "react";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { useLanguage } from "../LanguageContext";

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer
      id="footer"
      className={`bg-[#fdfaf8] py-10 px-6 ${lang === "ar" ? "rtl font-cairo" : "ltr font-sans text-brown-800"}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">

        {/* Left Side: Contact & Quick Links */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-20 w-full">
          {/* Contact Info */}
          <div className="flex flex-col items-start md:items-start text-center md:text-left">
            <h2 className="font-semibold text-lg mb-3">
              {lang === "en" ? "Contact Us" : "تواصل معنا"}
            </h2>
            <p className="text-sm mb-2">{lang === "en" ? "Phone" : "هاتف"}: +20 102 715 7089</p>
            <p className="text-sm mb-2">{lang === "en" ? "Phone" : "هاتف"}: +20 100 104 1499</p>

            <div className="flex gap-4 mt-2 justify-center md:justify-start">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 transition-colors hover:text-blue-700"
              >
                <FaFacebookF size={30} />
              </a>

              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 transition-colors hover:text-pink-700"
              >
                <FaInstagram size={30} />
              </a>

              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black transition-colors hover:opacity-70"
              >
                <FaTiktok size={30} />
              </a>

              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 transition-colors hover:text-red-800"
              >
                <FaYoutube size={30} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="font-semibold text-lg mb-3">
              {lang === "en" ? "Quick Links" : "روابط سريعة"}
            </h2>
            <ul className="text-sm space-y-1">
              <li>
                <a href="/NewArrvial" className="hover:text-brown-700 transition-colors">
                  {lang === "en" ? "New Arrivals" : "الأحدث"}
                </a>
              </li>
              <li>
                <a href="/topsellers" className="hover:text-brown-700 transition-colors">
                  {lang === "en" ? "Top Sellers" : "الأكثر مبيعًا"}
                </a>
              </li>
              <li>
                <a href="/AllScarfs" className="hover:text-brown-700 transition-colors">
                  {lang === "en" ? "All Scarfs" : "كل الأوشحة"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Logo & Brand */}
        <div className="flex flex-col items-center md:items-end mt-6 md:mt-0 text-center md:text-right">
          <Image
            src="/lgo.jpg"
            alt="قَمَرْ Logo"
            width={120}
            height={120}
            className="mb-3 rounded-full"
          />
          <h1
            className="text-2xl font-bold"
            style={{
              fontFamily: "'Diwani Letter', sans-serif",
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#b45309",
            }}
          >
            قَمَرْ
          </h1>
          <p
            className="text-sm mt-2"
            style={{
              fontFamily: "'Diwani Letter', sans-serif",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {lang === "en"
              ? "Luxury scarves and wraps, handcrafted for style and elegance."
              : "أوشحة وأغطية فاخرة، مصنوعة يدويًا من أجل الأناقة والأسلوب."}
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="mt-10 border-t border-brown-300 pt-4 text-center text-sm text-brown-600"
      >
        &copy; {new Date().getFullYear()}{" "}
        <span style={{ fontFamily: "'Diwani Letter', sans-serif" }}>قَمَرْ</span>.{" "}
        {lang === "en" ? "All rights reserved." : "جميع الحقوق محفوظة."}
      </div>
    </footer>
  );
}
