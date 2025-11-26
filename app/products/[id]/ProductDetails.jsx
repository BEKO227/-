"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { useCart } from "../../CartContext";
import { useAuth } from "../../AuthContext";
import { useRouter } from "next/navigation";
import { db } from "../../../lib/firebase";

export default function ProductDetails({ id }) {
  const [scarf, setScarf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const fetchScarf = async () => {
    try {
      const docRef = doc(db, "scarves", id.toString());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setScarf({ id: docSnap.id, ...docSnap.data() });
      } else {
        setScarf(null);
      }
    } catch (error) {
      console.error("Error fetching scarf:", error);
      setScarf(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScarf();
  }, [id]);

  // 🔥 Add to cart AND update Firestore stock
const handleAddToCart = async () => {
  try {
    if (!scarf?.id) {
      console.error("No scarf ID found");
      return;
    }

    const docRef = doc(db, "scarves", String(id));

    await updateDoc(docRef, {
      stock: scarf.stock - 1,
    });

    addToCart(scarf);
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};


  // ⭐ Submit rating
  const submitRating = async () => {
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    if (userRating < 1 || userRating > 5) return;

    setRatingSubmitting(true);

    try {
      const docRef = doc(db, "scarves", scarf.id);

      // Recalculate new rating average
      const newAvg =
        (scarf.ratingsAverage * scarf.ratingsQuantity + userRating) /
        (scarf.ratingsQuantity + 1);

      await updateDoc(docRef, {
        ratingsAverage: newAvg,
        ratingsQuantity: increment(1),
      });

      setUserRating(0);
      fetchScarf();
    } catch (err) {
      console.error(err);
    }

    setRatingSubmitting(false);
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-xl text-amber-700">
        Loading product...
      </div>
    );
  }

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
          <Link
            href="/"
            className="py-2 px-4 border text-amber-950 rounded-full hover:bg-amber-700 transition-colors"
          >
            🏚️
          </Link>
          <div className="text-2xl font-bold text-amber-700">قَمَرْ</div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-20 py-10 flex flex-col md:flex-row gap-10">
        <div className="flex-1 relative">
          <Image
            src={scarf.imageCover}
            alt={scarf.title}
            width={400}
            height={400}
            className="rounded-lg shadow-lg"
          />
            <div className="absolute top-3 left-3 flex flex-col gap-1">
            {scarf.isNewArrival && (
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                New Arrival
              </span>
            )}
            {scarf.isTopSeller && (
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Top Seller
              </span>
            )}
            {scarf.isOnSale && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                On Sale
              </span>
            )}
          </div>
          </div>

        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">
            {scarf.title}
          </h1>
          <p className="text-gray-700 mt-4 leading-relaxed">
            {scarf.description}
          </p>
          <p className="text-2xl font-semibold text-amber-700 mb-4">
            {scarf.price} EGP
          </p>
          <p className="text-lg text-gray-700 mb-2">
            ⭐ {scarf.ratingsAverage.toFixed(1)} ({scarf.ratingsQuantity} reviews)
          </p>

          <div className="text-lg mb-4">
            {scarf.stock > 0 ? 
              <span className="text-green-600 font-bold">In Stock</span>  
              : 
              <span className="text-red-600 font-bold">Out of Stock</span>            
            }
          </div>

          {/* Stock-based button */}
          <button
            onClick={handleAddToCart}
            disabled={scarf.stock <= 0}
            className={`mt-4 px-6 py-3 rounded-full text-white ${
              scarf.stock <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-700 hover:bg-amber-800"
            }`}
          >
            {scarf.stock <= 0 ? "Out of Stock" : "Add to Cart"}
          </button>

          {/* How to Style Button */}
          {scarf.styleVideo && (
            <Link
              href={`/products/${scarf.id}/style`}
              className="mt-4 inline-block bg-amber-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors text-center"
            >
              How to Style
            </Link>
          )}

          {/* ⭐ Rating System */}
          <div className="mt-8 p-4 border rounded-xl bg-white shadow-sm">
            <h3 className="text-xl font-bold text-amber-800 mb-2">
              Rate This Product
            </h3>

            <div className="flex gap-2 text-3xl cursor-pointer mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setUserRating(star)}
                  className={star <= userRating ? "text-yellow-500" : "text-gray-400"}
                >
                  ★
                </span>
              ))}
            </div>

            <button
              onClick={submitRating}
              disabled={ratingSubmitting || userRating === 0}
              className="px-6 py-2 bg-amber-700 text-white rounded-full hover:bg-amber-800 disabled:bg-gray-400"
            >
              {ratingSubmitting ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
