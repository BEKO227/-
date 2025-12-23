"use client";

import React from "react";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="bg-[#fdfaf8] py-10 px-6 ltr font-sans text-brown-800"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">

        {/* Left Side: Contact & Quick Links */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-20 w-full">
          
          {/* Contact Info */}
          <div className="flex flex-col items-start text-left">
            <h2 className="font-semibold text-lg mb-3">Contact Us</h2>
            <p className="text-sm mb-2">Phone: +20 102 715 7089</p>
            <p className="text-sm mb-2">Phone: +20 100 104 1499</p>

            <div className="flex gap-4 mt-2">
              {/* <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                <FaFacebookF size={30} />
              </a> */}

              <a href="https://www.instagram.com/qamar_scarves/" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700">
                <FaInstagram size={30} />
              </a>

              <a href="https://www.tiktok.com/@qamar.scarves" target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-70">
                <FaTiktok size={30} />
              </a>
{/* 
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800">
                <FaYoutube size={30} />
              </a> */}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start text-left">
            <h2 className="font-semibold text-lg mb-3">Quick Links</h2>
            <ul className="text-sm space-y-1">
              <li>
                <a href="/NewArrvial" className="hover:text-amber-700">New Arrivals</a>
              </li>
              <li>
                <a href="/topsellers" className="hover:text-amber-700">Top Sellers</a>
              </li>
              <li>
                <a href="/AllScarfs" className="hover:text-amber-700">All Scarves</a>
              </li>
              <li>
                <a href="/AboutUs" className="hover:text-amber-700">About Us</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Logo & Brand */}
        <div className="flex flex-col items-center md:items-end text-right">
          <Image
            src="/circle_logo.png"
            alt="قَمَرْ Logo"
            width={120}
            height={120}
            className="mb-3 rounded-full"
          />

          {/* Arabic Slogan */}
          <p
            className="text-sm mt-2"
            style={{
              fontFamily: "'Diwani Letter', sans-serif",
              fontSize: "1.4rem",
              fontWeight: "bold",
            }}
          >
            أوشحة وأغطية فاخرة، مصنوعة خصيصًا من أجل الأناقة و التميز
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-brown-300 pt-4 text-center text-sm text-brown-600"
            style={{
            fontFamily: "'Diwani Letter', sans-serif",
           }}
      >
        &copy; {new Date().getFullYear()} قَمَرْ. All rights reserved.
      </div>
    </footer>
  );
}
