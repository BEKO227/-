"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useCart } from "../../CartContext";
import { useAuth } from "../../AuthContext";
import { useRouter } from "next/navigation";
import { db } from "../../../lib/firebase";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";
import { FaLock } from "react-icons/fa";

/* =======================
  Helper Functions
======================= */
const getText = (lang, en, ar) => (lang === "ar" ? ar || en : en);

/* =======================
  Components
======================= */
const ColorSelector = ({ colors, selectedColor, setSelectedColor, lang }) => {
  if (!colors?.length) return null;

  return (
    <div className="mt-4">
      <p className="mb-2 text-sm sm:text-base text-gray-600 font-medium">
        {lang === "en" ? "Choose color:" : "اختر اللون:"}
      </p>
      <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 mb-2">
      {colors.map((color, index) => {
  const outOfStock = color.stock <= 0;

  return (
    <div
      key={index}
      className="relative w-6 h-6 sm:w-8 sm:h-8 group shrink-0"
    >
      <button
        onClick={() => setSelectedColor(color)} // always allow selecting the color
        className={`w-full h-full rounded-full border-2 transition-all duration-300
          ${
            selectedColor?.name === color.name
              ? "border-amber-500 shadow-lg shadow-amber-200"
              : "border-gray-300"
          }
          ${outOfStock ? "opacity-50 cursor-not-allowed filter grayscale" : "hover:scale-110"}
        `}
        style={{ backgroundColor: color.hex }}
      />

      {outOfStock && (
        <>
          <span className="absolute left-0 right-0 top-1/2 h-0.5 bg-red-500 rounded pointer-events-none" />
          <FaLock className="absolute inset-0 m-auto text-red-500 text-[10px] sm:text-[12px] pointer-events-none" />
        </>
      )}

      <span className="absolute -top-6 left-1/2 -translate-x-1/2
        bg-gray-800 text-white text-xs rounded py-0.5 px-2
        opacity-0 group-hover:opacity-100 transition-opacity
        sm:group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap"
      >
        {outOfStock ? (lang === "en" ? "Out of stock" : "غير متوفر") : color.name}
      </span>
    </div>
  );
})}

      </div>

      <div className="mt-4 p-4 rounded-2xl bg-linear-to-r from-amber-50 to-amber-100 shadow-md border border-amber-200 text-sm text-gray-700">
        <p>
          {lang === "en"
            ? "⚠️ Please note that product colors may appear slightly different due to lighting, screen resolution, and photography."
            : "⚠️ يرجى ملاحظة أن ألوان المنتج قد تبدو مختلفة قليلاً بسبب الإضاءة ودقة الشاشة والتصوير."}
        </p>
        <p>
          {lang === "en"
            ? "Minor variations in texture or shade are normal and do not affect the quality or authenticity of the product."
            : "الاختلافات الطفيفة في الملمس أو اللون طبيعية ولا تؤثر على جودة أو أصالة المنتج."}
        </p>
      </div>
    </div>
  );
};

const ImageGallery = ({ images, selectedColor, activeImage, setActiveImage, setIsImageOpen, getText, scarf, isImageOpen }) => {
  const mainImage = selectedColor?.image || images[activeImage] || images[0];

  return (
    <div className="flex-1">
      <div
        className="relative cursor-zoom-in rounded-2xl overflow-hidden shadow-lg"
        onClick={() => setIsImageOpen(true)}
      >
        <Image
          src={mainImage}
          alt={getText(scarf.title, scarf.titleAr)}
          width={500}
          height={500}
          className="rounded-2xl object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 mt-4 justify-center">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`border rounded-lg p-1 transition ${
                activeImage === index && !selectedColor
                  ? "border-amber-700 shadow-lg"
                  : "border-gray-300"
              }`}
            >
              <Image
                src={img}
                alt="thumbnail"
                width={80}
                height={80}
                className="rounded-md object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {isImageOpen && mainImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setIsImageOpen(false)}
        >
          <Image
            src={mainImage}
            alt="Full Image"
            width={900}
            height={900}
            className="rounded-xl object-contain max-h-[90vh]"
          />
        </div>
      )}
    </div>
  );
};

const CartControls = ({
  itemInCart,
  handleAddToCart,
  handleUpdateQuantity,
  handleRemoveFromCart,
  disabled,
}) => {
  if (!itemInCart) {
    return (
      <button
        onClick={handleAddToCart}
        disabled={disabled}
        className={`mt-3 w-full py-2 rounded-full text-[16px] font-semibold text-white transition-all duration-300 ${
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-linear-to-r from-amber-700 to-amber-900 hover:opacity-90 shadow"
        }`}
      >
        {disabled ? "Out of Stock" : "Add to Cart"}
      </button>
    );
  }

  return (
    <div className="mt-3 flex items-center justify-between">
      {itemInCart.quantity === 1 ? (
        <button
          onClick={handleRemoveFromCart}
          className="p-2 bg-red-500 text-white rounded-full shadow-lg transition"
        >
          <Trash size={18} />
        </button>
      ) : (
        <button
          onClick={() => handleUpdateQuantity(itemInCart.quantity - 1)}
          className="px-4 py-2 bg-gray-200 rounded-full font-bold shadow-sm transition"
        >
          -
        </button>
      )}

      <span className="px-4 text-lg font-semibold">{itemInCart.quantity}</span>

      <button
        onClick={() => handleUpdateQuantity(itemInCart.quantity + 1)}
        className="px-4 py-2 bg-gray-200 rounded-full font-bold shadow-sm transition"
      >
        +
      </button>
    </div>
  );
};

/* =======================
  Main ProductDetails Component
======================= */
export default function ProductDetails({ id }) {
  const [scarf, setScarf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { lang } = useLanguage();

  const getTotalStock = () => {
    if (!scarf?.colors || scarf.colors.length === 0) return scarf?.stock || 0;
    return scarf.colors.reduce((sum, color) => sum + (color.stock || 0), 0);
  };

  const currentUniqueId = scarf
    ? scarf.colors?.length > 0 && selectedColor
      ? `${scarf.id}-${selectedColor.name}`
      : scarf.id
    : null;

  const itemInCart = currentUniqueId
    ? cart.find((i) => String(i.uniqueId) === String(currentUniqueId))
    : undefined;

  const fetchScarf = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "scarves", id.toString());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        setScarf(data);
        if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
      } else setScarf(null);
    } catch (err) {
      console.error(err);
      setScarf(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScarf();
  }, [id]);

  const requireLogin = () => {
    toast.error(getText(lang, "Please log in first", "يرجى تسجيل الدخول أولاً"));
    setTimeout(() => router.push("/auth/signin"), 1000);
  };

  const handleAddToCart = () => {
    if (!user) return requireLogin();

    if (selectedColor && selectedColor.stock <= 0) {
      toast.error(getText(lang, "This color is out of stock", "هذا اللون غير متوفر"));
      return;
    }

    if (scarf.colors?.length > 0 && !selectedColor) {
      toast.error(getText(lang, "Please choose a color", "اختر اللون أولاً"));
      return;
    }

    addToCart({
      ...scarf,
      selectedColor: selectedColor
        ? {
            name: selectedColor.name,
            hex: selectedColor.hex,
            image: selectedColor.image || null,
            stock: selectedColor.stock || 0,
          }
        : null,
      uniqueId: currentUniqueId,
    });
  };

  const handleUpdateQuantity = (quantity) => {
    if (!user) return requireLogin();
    updateQuantity(currentUniqueId, quantity);
  };

  const handleRemoveFromCart = () => {
    if (!user) return requireLogin();
    removeFromCart(currentUniqueId);
  };

  if (loading)
    return (
      <div className="p-10 text-center text-xl text-amber-700">
        {getText(lang, "Loading product...", "جاري تحميل المنتج...")}
      </div>
    );

  if (!scarf)
    return (
      <div className="p-10 text-center text-xl font-bold text-red-600">
        {getText(lang, "Product Not Found", "المنتج غير موجود")}
      </div>
    );

  const images = scarf.images?.length
    ? scarf.images
    : scarf.imageCover
    ? [scarf.imageCover]
    : [];

  const disabled =
    getTotalStock() <= 0 || (selectedColor && selectedColor.stock <= 0);

  return (
    <>
      {/* Navbar */}
      <div className="w-full bg-[#fdfaf7] py-3 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          <button
            onClick={() => router.back()}
            className="py-2 px-4 border text-amber-950 rounded-full hover:bg-amber-700 transition-colors duration-300"
          >
            ← {lang === "ar" ? "رجوع" : "Back"}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-20 py-10 flex flex-col md:flex-row gap-12">
        <ImageGallery
          images={images}
          selectedColor={selectedColor}
          activeImage={activeImage}
          setActiveImage={setActiveImage}
          setIsImageOpen={setIsImageOpen}
          getText={(en, ar) => getText(lang, en, ar)}
          scarf={scarf}
          isImageOpen={isImageOpen}
        />

        {/* Details */}
        <div className="flex-1 flex flex-col justify-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold text-amber-800 mb-2">
            {getText(lang, scarf.title, scarf.titleAr)}
          </h1>

          {scarf.category && (
            <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-semibold bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 text-white shadow-lg border border-amber-300 uppercase tracking-wide">
              {getText(lang, scarf.category, scarf.categoryAr)}
            </span>
          )}

          <p className="text-gray-700 leading-relaxed mb-4">
            {getText(lang, scarf.description, scarf.descriptionAr)}
          </p>

          <ColorSelector
            colors={scarf.colors}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            lang={lang}
          />

          <p className="text-2xl font-semibold text-amber-700">{scarf.price} EGP</p>

          <div className="mb-4">
            {getTotalStock() > 0 ? (
              <span className="text-green-600 font-bold px-3 py-1 rounded-full bg-green-50 border border-green-200">
                {getText(lang, "In Stock", "متوفر")}
              </span>
            ) : (
              <span className="text-red-600 font-bold px-3 py-1 rounded-full bg-red-50 border border-red-200">
                {getText(lang, "Out of Stock", "نفذ المخزون")}
              </span>
            )}
          </div>

          <CartControls
            itemInCart={itemInCart}
            handleAddToCart={handleAddToCart}
            handleUpdateQuantity={handleUpdateQuantity}
            handleRemoveFromCart={handleRemoveFromCart}
            disabled={disabled}
          />
        </div>
      </div>
    </>
  );
}
