"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useCart } from "../CartContext";
import { useAuth } from "../AuthContext";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductCard({ product, small = false }) {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);

  // check if product in cart
  const itemInCart = cart.find((i) => i.id === product.id);

  useEffect(() => {
    setDisabled(product.stock <= 0);
  }, [product.stock]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      router.push("/auth/signin");
      return;
    }
    addToCart(product);
    toast.success("Product added to cart");
  };

  const goToDetails = () => {
    router.push(`/products/${product.id}`);
  };

  const badgeClasses = {
    "New Arrival": "bg-blue-500",
    "Top Seller": "bg-green-500",
    "On Sale": "bg-red-500",
  };

  const badges = [];
  if (product.isNewArrival) badges.push("New Arrival");
  if (product.isTopSeller) badges.push("Top Seller");
  if (product.isOnSale) badges.push("On Sale");

  return (
    <Card
      onClick={goToDetails}
      className="shadow-md rounded-2xl overflow-hidden w-full max-w-[320px] mx-auto cursor-pointer hover:shadow-xl transition relative"
    >
      <CardHeader className="p-0 relative">
        <div className="relative w-full h-64">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            className="object-cover rounded-t-2xl"
          />
        </div>

        {/* badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {badges.map((badge) => (
            <span
              key={badge}
              className={`text-white text-xs font-bold px-2 py-1 rounded-full ${badgeClasses[badge]}`}
            >
              {badge}
            </span>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <CardTitle className="text-lg font-medium text-amber-800">
          {product.title}
        </CardTitle>

        <p className="text-amber-700 font-semibold mt-1">
          {product.price} EGP
        </p>

        <p className="mt-2 text-gray-600">
          {product.stock > 0 ? (
            <span className="text-green-600 font-bold">In Stock</span>
          ) : (
            <span className="text-red-600 font-bold">Out of Stock</span>
          )}
        </p>

        {/* ------------------------------ */}
        {/* CART LOGIC - keeps your UI    */}
        {/* ------------------------------ */}
        {!itemInCart ? (
          /** Add to cart button (same UI) */
          <button
            onClick={handleAddToCart}
            disabled={disabled}
            className={`mt-2 w-full py-2 rounded-full font-semibold text-white ${
              disabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-700 hover:bg-amber-800"
            }`}
          >
            {disabled ? "Out of Stock" : "Add to Cart"}
          </button>
        ) : (
          /** Replace add-to-cart with quantity controls */
          <div
            className="mt-3 flex items-center justify-between"
            onClick={(e) => e.stopPropagation()} // stop navigation
          >
            {/* If quantity = 1 -> show trash */}
            {itemInCart.quantity === 1 ? (
              <button
                onClick={() => removeFromCart(product.id)}
                className="p-2 bg-red-500 text-white rounded-full"
              >
                <Trash size={18} />
              </button>
            ) : (
              <button
                onClick={() =>
                  updateQuantity(product.id, itemInCart.quantity - 1)
                }
                className="px-4 py-2 bg-gray-200 rounded-full text-lg font-bold"
              >
                -
              </button>
            )}

            {/* Quantity */}
            <span className="px-4 text-lg font-semibold">
              {itemInCart.quantity}
            </span>

            {/* Plus */}
            <button
              onClick={() =>
                updateQuantity(product.id, itemInCart.quantity + 1)
              }
              className="px-4 py-2 bg-gray-200 rounded-full text-lg font-bold"
            >
              +
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
