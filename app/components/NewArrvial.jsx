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
import { allScarfs } from "../data/products";

export default function NewArrival() {
  const autoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const newArrivals = allScarfs.filter((scarf) => scarf.isNewArrival);

  return (
    <section id="new-arrivals" className="relative w-full ms-2">
      <Carousel
        plugins={[autoplay.current]}
        className="w-full"
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
                      {scarf.title}
                    </h2>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black px-4 py-2 rounded-full transition" />
        <CarouselNext className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black px-4 py-2 rounded-full transition" />
      </Carousel>
    </section>
  );
}
