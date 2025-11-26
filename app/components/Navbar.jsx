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
import Link from "next/link";
import { useAuth } from "../AuthContext";
import { useCart } from "../CartContext";
import { FaShoppingCart } from "react-icons/fa";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const links = [
    { label: "NEW ARRIVALS", href: "/NewArrvial" },
    { label: "TOP SELLERS", href: "/topsellers" },
    { label: "ALL SCARFS", href: "/AllScarfs" },
    { label: "CONTACT US", href: "#footer" },
  ];

  return (
    <nav className="bg-white shadow-md px-6 py-4 relative">
      {/* Desktop Navbar */}
      <div className="hidden md:flex items-center justify-between">
        {/* Left links */}
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

        {/* Logo */}
        <div className="rounded-full absolute left-1/2 transform -translate-x-1/2">
          <Image
            src="/logo.png"
            alt="قَمَرْ Logo"
            width={80}
            height={80}
            className="object-contain rounded-full"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 relative">
          {/* User */}
          {user ? (
            <>
              <span
                style={{
                  fontFamily: "'Diwani Letter', sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#b45309",
                }}
              >
                {user.displayName || user.email}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition-colors"
              >
                Logout
              </button>
                        {/* Cart */}
          <div className="relative">
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative text-amber-700 hover:text-amber-800"
            >
              <FaShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Cart Dropdown */}
            {cartOpen && cart.length > 0 && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded p-4 z-50">
                {cart.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between mb-2 border-b pb-1"
                  >
                    <span>{item.title}</span>
                    <span>
                      {item.quantity} x {item.price} EGP
                    </span>
                  </div>
                ))}
                {cart.length > 3 && (
                  <p className="text-sm text-gray-500">And more...</p>
                )}
                <Link
                  href="/Cart"
                  className="block mt-2 text-center bg-amber-700 text-white py-2 rounded hover:bg-amber-800"
                  onClick={() => setCartOpen(false)}
                >
                  View Cart
                </Link>
              </div>
            )}
          </div>
            </>
          ) : (
            <Link href="/auth/signin">
              <button className="px-4 py-2 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition-colors">
                Log In
              </button>
            </Link>
          )}

        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex justify-between items-center md:hidden">
        <Button
          variant="outline"
          className="text-amber-700 border-amber-700"
          onClick={() => setOpen(!open)}
        >
          <Menu size={20} />
        </Button>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Image
            src="/logo.png"
            alt="قَمَرْ Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
                      {/* Mobile Cart */}
          <div className="relative">
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative text-amber-700 hover:text-amber-800"
            >
              <FaShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {cartOpen && cart.length > 0 && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded p-4 z-50">
                {cart.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between mb-2 border-b pb-1"
                  >
                    <span>{item.title}</span>
                    <span>
                      {item.quantity} x ${item.price}
                    </span>
                  </div>
                ))}
                {cart.length > 3 && (
                  <p className="text-sm text-gray-500">And more...</p>
                )}
                <Link
                  href="/Cart"
                  className="block mt-2 text-center bg-amber-700 text-white py-2 rounded hover:bg-amber-800"
                  onClick={() => setCartOpen(false)}
                >
                  View Cart
                </Link>
              </div>
            )}
          </div>
          <button
              onClick={logout}
              className="px-3 py-1 bg-amber-700 text-white rounded-full text-sm"
            >
              Logout
            </button>
            </>
          ) : (
            <Link href="/auth/signin">
              <button className="px-3 py-1 bg-amber-700 text-white rounded-full text-sm">
                Log In
              </button>
            </Link>
          )}

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center py-4 space-y-4 md:hidden z-50">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-amber-700 font-medium text-lg hover:text-amber-800"
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
