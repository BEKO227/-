"use client";

import React from "react";
import Image from "next/image";
import { FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-linear-to-t from-[#fdfaf8] to-[#fffaf2] py-10 px-4 font-sans text-brown-800">
      <div className="max-w-7xl mx-auto">

        {/* Main content */}
        <div className="flex flex-col md:flex-row md:justify-between gap-10 md:gap-0">

          {/* Left columns: Contact + Links */}
          <div className="grid grid-cols-2 gap-6 md:gap-10">

            {/* Contact */}
            <div>
              <h2 className="font-semibold text-lg mb-3">Contact</h2>
              <p className="text-sm mb-1">+20 102 715 7089</p>
              <p className="text-sm">+20 100 104 1499</p>

              <div className="flex gap-4 mt-2">
                <a
                  href="https://www.instagram.com/qamar_scarves/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-700 transition-all duration-300"
                >
                  <FaInstagram size={20} />
                </a>
                <a
                  href="https://www.tiktok.com/@qamar.scarves"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-700 transition-all duration-300"
                >
                  <FaTiktok size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="font-semibold text-lg mb-3">Links</h2>
              <ul className="space-y-2 text-sm">
                <li><a href="/NewArrvial" className="hover:text-amber-700 transition-colors">New Arrivals</a></li>
                <li><a href="/topsellers" className="hover:text-amber-700 transition-colors">Top Sellers</a></li>
                <li><a href="/AllScarfs" className="hover:text-amber-700 transition-colors">All Scarves</a></li>
                <li><a href="/AboutUs" className="hover:text-amber-700 transition-colors">About Us</a></li>
              </ul>
            </div>
          </div>

          {/* Right column: Logo + Tagline */}
          <div className="flex flex-col items-center text-center">
            <Image
              src="/circle_logo.png"
              alt="قَمَرْ Logo"
              width={80}
              height={80}
              className="rounded-full mb-3"
            />
            <p
              className="leading-tight text-amber-900 font-semibold text-sm md:text-base"
              style={{ fontFamily: "'Diwani Letter', sans-serif" }}
            >
              أوشحة وأغطية فاخرة
              <br />
              مصنوعة من أجل الأناقة
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-8 border-t border-brown-300 pt-4 text-center text-sm text-brown-600"
          style={{ fontFamily: "'Diwani Letter', sans-serif" }}
        >
          &copy; {new Date().getFullYear()} قَمَرْ. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
