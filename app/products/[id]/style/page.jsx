"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";

export default function StylePage() {
  const params = useParams();
  const { id } = params;

  const [scarf, setScarf] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchScarf();
  }, [id]);

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

  // Convert YouTube URL to embed format
  const getEmbedUrl = (url) => {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes("youtu.be")) {
        const videoId = parsed.pathname.slice(1);
        return `https://www.youtube.com/embed/${videoId}`;
      } else if (parsed.hostname.includes("youtube.com")) {
        const videoId = parsed.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }
      return url;
    } catch {
      return url;
    }
  };

  const videoUrl = getEmbedUrl(scarf.styleVideo);

  return (
    <div className="min-h-screen from-[#fdfaf7] to-[#f9f5f0] py-10">
      <div className="max-w-6xl mx-auto px-6 md:px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <Link
            href={`/products/${id}`}
            className="py-2 px-4 bg-brown-800 text-amber-950 rounded-full hover:bg-brown-700 shadow-md transition-colors flex items-center gap-2"
          >
            ← Back to Product
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-amber-800 text-center md:text-left">
            How to Style: {scarf.title}
          </h1>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Video */}
          <div className="flex-1 w-full shadow-lg rounded-xl overflow-hidden">
            {videoUrl.includes("youtube.com/embed") ? (
              <iframe
                width="100%"
                height="100%"
                className="aspect-video"
                src={videoUrl}
                title={`How to Style ${scarf.title}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                src={videoUrl}
                controls
                className="w-full aspect-video object-cover"
              />
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden shadow-md">
              <Image
                src={scarf.imageCover}
                alt={scarf.title}
                fill
                className="object-cover rounded-xl"
              />
              {scarf.isNewArrival && (
                <div className="absolute top-4 left-4 bg-green-500 text-white font-bold px-3 py-1 rounded-full text-sm shadow-md">
                  New Arrival
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-amber-800">{scarf.title}</h2>
            <p className="text-gray-700 leading-relaxed">{scarf.description}</p>
            <p className="text-2xl font-semibold text-amber-700">${scarf.price}</p>

            {scarf.tag && (
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm text-center font-semibold my-2 ${
                  scarf.tag === "Top Seller"
                    ? "bg-yellow-400 text-white"
                    : scarf.tag === "On Sale"
                    ? "bg-red-500 text-white"
                    : "bg-gray-400 text-white"
                }`}
              >
                {scarf.tag}
              </div>
            )}

            <p className="text-gray-600 mt-2">
              ⭐ {scarf.ratingsAverage} ({scarf.ratingsQuantity} reviews)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
