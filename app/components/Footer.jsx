"use client";

import React from "react";
import Image from "next/image";
import { FaFacebookF, FaInstagram , FaTiktok , FaYoutube} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#fdfaf8] text-brown-800 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">

        {/* Left Side: Contact & Quick Links */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-20 w-full">
          {/* Contact Info */}
          <div className="flex flex-col items-start md:items-start text-center md:text-left">
            <h2 className="font-semibold text-lg mb-3">Contact Us</h2>
            <p className="text-sm mb-2">Phone: +20 102 715 7089 - +20 100 104 1499</p>
            <div className="flex gap-4 mt-2 justify-center md:justify-start">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 transition-colors hover:text-blue-700"
              >
                <FaFacebookF size={20} />
              </a>

              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 transition-colors hover:text-pink-700"
              >
                <FaInstagram size={20} />
              </a>

              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black transition-colors hover:opacity-70"
              >
                <FaTiktok size={20} />
              </a>

              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 transition-colors hover:text-red-800"
              >
                <FaYoutube size={22} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="font-semibold text-lg mb-3">Quick Links</h2>
            <ul className="text-sm space-y-1">
              <li>
                <a href="#new-arrivals" className="hover:text-brown-700 transition-colors">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#top-sellers" className="hover:text-brown-700 transition-colors">
                  Top Sellers
                </a>
              </li>
              <li>
                <a href="#all-scarfs" className="hover:text-brown-700 transition-colors">
                  All Scarfs
                </a>
              </li>
              <li>
                <a href="#contact-us" className="hover:text-brown-700 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Logo & Brand */}
        <div className="flex flex-col items-center md:items-end mt-6 md:mt-0">
          <Image
            src="/lgo.jpg"
            alt="قَمَرْ Logo"
            width={120}
            height={120}
            className="mb-3 rounded-full"
          />
          <h1 className="text-2xl font-bold text-center md:text-right">قَمَرْ</h1>
          <p className="text-sm mt-2 text-brown-600 text-center md:text-right">
            أوشحة وأغطية فاخرة، مصنوعة يدويًا من أجل الأناقة والأسلوب.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-brown-300 pt-4 text-center text-sm text-brown-600">
        &copy; {new Date().getFullYear()} قَمَرْ. All rights reserved.
      </div>
    </footer>
  );
}
