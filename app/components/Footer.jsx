"use client";

import React from "react";
import Image from "next/image";
import { FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#fdfaf8] py-6 px-4 font-sans text-brown-800">
      <div className="max-w-7xl mx-auto">

        {/* Main: 2 columns on mobile */}
        <div className="grid grid-cols-2 gap-4 md:flex md:justify-between md:gap-10">

          {/* LEFT MAIN COLUMN */}
          <div className="grid grid-cols-2 gap-3">

            {/* Contact */}
            <div>
              <h2 className="font-semibold text-xs md:text-lg mb-1">
                Contact
              </h2>
              <p className="text-[10px] md:text-sm">+20 102 715 7089</p>
              <p className="text-[10px] md:text-sm">+20 100 104 1499</p>

              <div className="flex gap-2 mt-1">
                <a
                  href="https://www.instagram.com/qamar_scarves/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70"
                >
                  <FaInstagram size={16} />
                </a>

                <a
                  href="https://www.tiktok.com/@qamar.scarves"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70"
                >
                  <FaTiktok size={16} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="font-semibold text-xs md:text-lg mb-1">
                Links
              </h2>
              <ul className="space-y-[2p0x] text-[10px] md:text-sm">
                <li><a href="/NewArrvial" className="hover:text-amber-700">New Arrivals</a></li>
                <li><a href="/topsellers" className="hover:text-amber-700">Top Sellers</a></li>
                <li><a href="/AllScarfs" className="hover:text-amber-700">All Scarves</a></li>
                <li><a href="/AboutUs" className="hover:text-amber-700">About Us</a></li>
              </ul>
            </div>
          </div>

          {/* RIGHT MAIN COLUMN */}
          <div className="flex flex-col items-center justify-center text-center">
            <Image
              src="/circle_logo.png"
              alt="قَمَرْ Logo"
              width={70}
              height={70}
              className="rounded-full"
            />

            <p
              className="mt-1 leading-tight"
              style={{
                fontFamily: "'Diwani Letter', sans-serif",
                fontSize: "0.95rem",
                fontWeight: "bold",
              }}
            >
              أوشحة وأغطية فاخرة
              <br />
              مصنوعة من أجل الأناقة
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-4 border-t border-brown-300 pt-2 text-center text-[10px] md:text-sm text-brown-600"
          style={{ fontFamily: "'Diwani Letter', sans-serif" }}
        >
          &copy; {new Date().getFullYear()} قَمَرْ. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
