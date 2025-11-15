"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product, small = false }) {
  const { title, price, ratingsAverage, ratingsQuantity, imageCover, tag, isNewArrival, slug } = product;

  const fullStars = Math.floor(ratingsAverage);
  const hasHalfStar = ratingsAverage % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <Link href={`/products/${product.id}`} className="w-full">
      <Card
        className={`w-full max-w-[${small ? "250px" : "320px"}] shadow-md rounded-2xl overflow-hidden mx-auto cursor-pointer hover:shadow-xl transition`}
      >
        {/* Product Image */}
        <CardHeader className="p-0 relative">
          {/* Existing Tag */}
          {tag && (
            <div
              className={`absolute top-2 left-2 text-white font-bold text-xs px-2 py-1 rounded z-10 ${
                tag === "Top Seller"
                  ? "bg-yellow-400"
                  : tag === "On Sale"
                  ? "bg-red-500"
                  : "bg-gray-400"
              }`}
            >
              {tag}
            </div>
          )}

          {/* New Arrival Tag */}
          {isNewArrival && (
            <div className="absolute top-2 right-2 text-white font-bold text-xs px-2 py-1 rounded z-10 bg-green-500">
              New Arrival
            </div>
          )}

          <div className="relative w-full h-64 sm:h-72 md:h-80">
            <Image
              src={imageCover}
              alt={title}
              fill
              className="object-cover rounded-t-2xl"
            />
          </div>
        </CardHeader>

        {/* Product Info */}
        <CardContent className="p-4">
          <CardTitle className="text-lg font-medium text-brown-800">{title}</CardTitle>
          <p className="text-brown-700 font-semibold mt-1">{price} EGP</p>

          {/* Ratings */}
          <div className="flex items-center gap-1 mt-2 text-yellow-400">
            {[...Array(fullStars)].map((_, i) => (
              <i key={`full-${i}`} className="fa-solid fa-star"></i>
            ))}
            {hasHalfStar && <i className="fa-solid fa-star-half-stroke"></i>}
            {[...Array(emptyStars)].map((_, i) => (
              <i key={`empty-${i}`} className="fa-regular fa-star"></i>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              ({ratingsAverage.toFixed(1)}) • {ratingsQuantity} reviews
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
