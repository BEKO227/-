"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from '@/app/LanguageContext';

export default function About() {
  const { lang } = useLanguage();

  return (
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
        `}      >
        {lang === "ar" ? "من نحن – قَمَرْ" : "About Us – Qamar"}
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
              <span className="text-3xl font-bold font-diwani text-[#C59C6F]">قَمَرْ</span>  
              هي علامة متخصصة في الأوشحة الفاخرة التي تجمع بين الأصالة العربية
              وروح الأناقة العصرية.  
              كل قطعة تُصنع بعناية فائقة، بخامات مختارة لتمنحك إحساسًا بالترف والراحة.
              <br /><br />
              تأسست قَمَرْ بهدف تقديم أوشحة تحمل جمال البساطة وروح الفخامة،  
              لتكون جزءًا من هوية كل امرأة تبحث عن الذوق الرفيع.
            </p>
          ) : (
            <p className="space-y-5">
              <span className="text-3xl font-semibold text-[#C59C6F]">Qamar</span>  
              is a luxury scarf brand blending timeless Arabic elegance with modern design.  
              Each scarf is crafted with exceptional care, using premium materials that feel
              soft, elegant, and effortlessly refined.
              <br /><br />
              Qamar was founded to offer pieces that represent beauty, delicacy, and
              sophistication — a perfect reflection of the woman who wears them.
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
              في <span className="text-3xl font-bold font-diwani text-[#C59C6F]">قَمَرْ</span>، نؤمن أن الأوشحة أكثر من مجرد قطعة تُرتدى،
              إنها لغة تعبير، ولمسة جمال تضيف لمعانًا خاصًا لإطلالتك.
              <br /><br />
              نعمل على تقديم منتجات تعكس ذوقك، شخصيتك، وتفاصيلك الراقية.
            </p>
          ) : (
            <p className="space-y-5">
              At Qamar, we believe scarves are not just accessories —
              they are a language of elegance and an expression of individuality.
              <br /><br />
              Our mission is to create pieces that blend luxury, beauty, and identity.
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
            ? "أن نجعل كل امرأة تتألق عبر لمسات بسيطة تحمل معنى ورُقي."
            : "To bring elegance and meaning into every woman’s life through beautifully crafted pieces."}
        </p>
      </motion.div>

    </div>
  );
}
