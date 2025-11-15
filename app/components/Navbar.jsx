"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Menu } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "New Arrivals", href: "#new-arrivals" },
    { label: "Top Sellers", href: "/topsellers" },
    { label: "All Scarfs", href: "/AllScarfs" },
    { label: "Stylings", href: "#stylings" },
    { label: "Contact Us", href: "#contact-us" },
  ];

  return (
    <nav className="bg-white shadow-md px-6 py-4 relative">
      {/* Desktop Navbar */}
      <div className="hidden md:flex items-center justify-between">
        {/* Links on the left */}
        <div className="flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-4">
              {links.map((link) => (
                <NavigationMenuItem key={link.label}>
                  <NavigationMenuLink
                    href={link.href}
                    className={navigationMenuTriggerStyle()}
                  >
                    {link.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Logo image centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Image
            src="/logo.png"
            alt="قَمَرْ Logo"
            width={50}
            height={50}
            className="object-contain"
          />
        </div>

        {/* Text on the right */}
        <div className="text-2xl font-bold text-brown-700">قَمَرْ</div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex justify-between items-center md:hidden">
        {/* Hamburger on the left */}
        <Button
          variant="outline"
          className="text-brown-700 border-brown-700"
          onClick={() => setOpen(!open)}
        >
          <Menu size={20} />
        </Button>

        {/* Logo image centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Image
            src="/logo.png"
            alt="قَمَرْ Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Text on the right */}
        <div className="text-xl font-bold text-brown-700">قَمَرْ</div>
      </div>

      {/* Mobile Menu Drawer */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center py-4 space-y-4 md:hidden z-50">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-brown-700 font-medium text-lg hover:text-brown-800"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
