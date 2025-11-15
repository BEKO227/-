"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product, small = false }) {
  const {
    title,
    price,
    ratingsAverage,
    ratingsQuantity,
    imageCover,
    tag,
    isNewArrival,
  } = product;

  const fullStars = Math.floor(ratingsAverage);
  const hasHalfStar = ratingsAverage % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <Link href={`/products/${product.id}`} className="w-full">
      <Card
        className={`w-full max-w-[${small ? "250px" : "320px"}] shadow-md rounded-2xl overflow-hidden mx-auto cursor-pointer hover:shadow-xl transition`}
      >
        <CardHeader className="p-0 relative">
          {/* BADGE CONTAINER */}
          <div className="absolute top-2 left-2 right-2 z-10 flex justify-between pointer-events-none">
            {/* Left Badge (tag) */}
            <div className="flex flex-col gap-1">
              {tag && (
                <div
                  className={`
                    text-white font-semibold 
                    px-2 py-0.5 sm:px-3 sm:py-1 
                    text-[10px] sm:text-xs 
                    rounded-full shadow 
                    ${
                      tag === "Top Seller"
                        ? "bg-yellow-400"
                        : tag === "On Sale"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }
                  `}
                >
                  {tag}
                </div>
              )}
            </div>

            {/* Right Badge (New Arrival) */}
            <div className="flex flex-col gap-1 items-end">
              {isNewArrival && (
                <div
                  className="
                    text-white font-semibold 
                    px-2 py-0.5 sm:px-3 sm:py-1 
                    text-[10px] sm:text-xs 
                    rounded-full shadow bg-green-500
                  "
                >
                  New Arrival
                </div>
              )}
            </div>
          </div>

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
          <CardTitle className="text-lg font-medium text-amber-800">
            {title}
          </CardTitle>
          <p className="text-amber-700 font-semibold mt-1">{price} EGP</p>

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
