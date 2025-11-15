"use client";
import Image from "next/image";
import { allScarfs } from "../../data/products";
import Link from "next/link";

export default function ProductDetails({ id }) {
  const scarf = allScarfs.find((item) => item.id === Number(id));

  if (!scarf) {
    return (
      <div className="p-10 text-center text-xl font-bold text-red-600">
        Product Not Found
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-[#fdfaf7] py-2 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          {/* Left: Home Button */}
          <Link
            href="/"
            className="py-2 px-4 bg-brown-800 border text-amber-950 rounded-full hover:bg-brown-700 transition-colors"
          >
            🏚️
          </Link>

          {/* Right: Text */}
          <div className="text-2xl font-bold text-brown-700">قَمَرْ</div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-20 py-10 flex flex-col md:flex-row gap-10">
        {/* IMAGE */}
        <div className="flex-1 relative">
          <Image
            src={scarf.imageCover}
            alt={scarf.title}
            width={400}
            height={400}
            className="rounded-lg shadow-lg"
          />

          {/* New Arrival Badge */}
          {scarf.isNewArrival && (
            <div className="absolute top-4 left-4 bg-green-500 text-white font-bold px-3 py-1 rounded-full text-sm">
              New Arrival
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-brown-800 mb-4">{scarf.title}</h1>

          <p className="text-gray-700 mt-4 leading-relaxed">{scarf.description}</p>

          <p className="text-2xl font-semibold text-brown-700 mb-4">${scarf.price}</p>

          <p className="text-lg text-gray-700 mb-2">
            ⭐ {scarf.ratingsAverage} ({scarf.ratingsQuantity} reviews)
          </p>

          {scarf.tag && (
            <div
              className={`inline-block text-brown-800 px-3 py-1 rounded-full text-sm my-3 text-center ${
                scarf.tag === "Top Seller"
                  ? "bg-yellow-400"
                  : scarf.tag === "On Sale"
                  ? "bg-red-500"
                  : "bg-gray-400"
              }`}
            >
              {scarf.tag}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
