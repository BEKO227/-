"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from '@/app/LanguageContext';
import { useRouter } from "next/navigation";
export default function About() {
  const { lang } = useLanguage();
  const router = useRouter();

  return (
    <>
      <div className="w-full bg-[#fdfaf7] shadow-md py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          <button
            onClick={() => router.back()}
            className="py-2 px-4 border text-amber-950 rounded-full hover:bg-amber-700 transition-colors duration-300"
          >
            ← {lang === "ar" ? "رجوع" : "Back"}
          </button>
        </div>
      </div>
      <div
      className={`min-h-screen bg-[#FAF7F2] pt-20 pb-16 px-6 
        ${lang === "ar" ? "rtl font-cairo" : "ltr font-serif"}`}
    >

      {/* HEADER TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          text-4xl mb-6 text-center text-amber-900
          ${lang === "ar" ? "draw-ar" : "draw-en"}
        `}
      >
        {lang === "ar" ? "من نحن – قَمَرْ" : "About Us – Qamar Scarves"}
      </motion.h1>

      {/* GOLD DIVIDER */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent my-8" />

      {/* MAIN STORY SECTION */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <Image
            src="/premiumScarf.webp"
            alt="Luxury scarf"
            width={600}
            height={700}
            className="rounded-xl shadow-xl object-cover"
          />
        </motion.div>

        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="leading-relaxed text-lg md:text-xl text-[#4A3728]"
        >
          {lang === "ar" ? (
            <p className="space-y-5">
              <span className="text-3xl font-bold text-[#C59C6F] font-diwani">قَمَرْ</span>  
              هي منصة متخصصة في تقديم أفضل الماركات الفاخرة للأوشحة بأسعار تنافسية.  
              نحن نحرص على اختيار منتجات عالية الجودة لتمنحكِ الفخامة والراحة دون التضحية بالقيمة.  
              <br /><br />
              كل قطعة في مجموعتنا تم اختيارها بعناية لتوفر لكِ تشكيلة متنوعة من التصاميم التي تناسب كل الأذواق والمناسبات.
            </p>
          ) : (
            <p className="space-y-5">
              <span className="text-3xl font-semibold text-[#C59C6F]">Qamar Scarves</span>  
              is a premium reseller of high-quality scarf brands, offering competitive prices.  
              We carefully select each piece to ensure luxury, comfort, and exceptional value.  
              <br /><br />
              Our collection features a wide range of styles and designs, perfect for every taste and occasion.
            </p>
          )}
        </motion.div>
      </section>

      {/* SECOND SECTION */}
      <section className="max-w-6xl mx-auto mt-20 grid md:grid-cols-2 gap-14 items-center">
        
        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="leading-relaxed text-lg md:text-xl text-[#4A3728]"
        >
          {lang === "ar" ? (
            <p className="space-y-5">
              في <span className="text-3xl font-bold text-[#C59C6F] font-diwani">قَمَرْ</span>، نؤمن أن الأوشحة هي لمسة تكميلية أساسية لكل إطلالة.  
              نحن نقدم لكِ منتجات مختارة بعناية لتعكس ذوقكِ الشخصي وتضيف لمسة فخمة لكل مناسبة.  
              <br /><br />
              هدفنا هو توفير تشكيلة عالية الجودة بأسعار تنافسية، مع تجربة تسوق مريحة وسهلة لكل عملائنا.
            </p>
          ) : (
            <p className="space-y-5">
              At Qamar, we believe scarves are a key accessory for every look.  
              We offer carefully curated products that reflect your personal style and add a touch of luxury to any occasion.  
              <br /><br />
              Our mission is to provide high-quality scarves at competitive prices, delivering a smooth and premium shopping experience to all our customers.
            </p>
          )}
        </motion.div>

        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <Image
            src="/premiumScarf2.webp"
            alt="Premium scarf"
            width={600}
            height={700}
            className="rounded-xl shadow-xl object-cover"
          />
        </motion.div>

      </section>

      {/* GOLD DIVIDER */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent my-16" />

      {/* BRAND MISSION BOX */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="
          max-w-5xl mx-auto text-center bg-white/40 backdrop-blur-lg 
          p-10 md:p-14 rounded-2xl shadow-lg border border-[#D4AF37]/40
        "
      >
        <h2 className="text-3xl font-light text-[#5C3A29]">
          {lang === "ar" ? "رسالتنا" : "Our Mission"}
        </h2>

        <p className="mt-6 text-lg md:text-xl text-[#4A3728] leading-relaxed">
          {lang === "ar"
            ? "تقديم أوشحة عالية الجودة من أفضل الماركات بأسعار تنافسية مع تجربة تسوق مميزة وسهلة."
            : "To provide high-quality scarves from top brands at competitive prices, with a premium and seamless shopping experience."}
        </p>
      </motion.div>

    </div>
    </>

  );
}
