"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useLanguage } from "@/app/LanguageContext";

export default function NewArrival() {
  const { lang } = useLanguage();
  const autoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const [newArrivals, setNewArrivals] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchNewArrivals() {
      const querySnapshot = await getDocs(collection(db, "scarves"));
      const scarves = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.isNewArrival) scarves.push({ id: doc.id, ...data });
      });
      setNewArrivals(scarves);
      setLoading(false);
    }

    fetchNewArrivals();
  }, []);

  if (loading) {
    return (
      <section className="py-16 text-center text-amber-900">
        {lang === "en" ? "Loading new arrivals..." : "جاري تحميل الأحدث..."}
      </section>
    );
  }

  return (
    <section
      id="new-arrivals"
      className={`relative w-full ${lang === "ar" ? "rtl font-cairo" : "ltr"}`}
    >
      <h2 className="text-3xl font-semibold text-amber-900 text-center m-5">
        {lang === "en" ? "New Arrivals" : "الأحدث"}
      </h2>

      <Carousel
        plugins={[autoplay.current]}
        className="w-full ms-2"
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
      >
        <CarouselContent className="w-full">
          {newArrivals.map((scarf, index) => (
            <CarouselItem key={index} className="w-full">
              <Link href={`/products/${scarf.id}`}>
                <div className="relative w-full h-[80vh] flex flex-col justify-center items-center cursor-pointer">
                  <img
                    src={scarf.imageCover}
                    alt={scarf.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="relative z-10 bg-black/40 px-6 py-3 rounded-lg">
                    <h2 className="text-white text-4xl font-semibold">
                      {lang === "en" ? scarf.title : scarf.title_ar || scarf.title}
                    </h2>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black hover:text-white px-4 py-2 rounded-full transition cursor-pointer" />
        <CarouselNext className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black hover:text-white px-4 py-2 rounded-full transition cursor-pointer" />
      </Carousel>
    </section>
  );
}
