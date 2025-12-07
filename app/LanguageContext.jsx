"use client";
import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  // Load language from localStorage
  useEffect(() => {
    const storedLang = localStorage.getItem("lang");
    if (storedLang) setLang(storedLang);
  }, []);

  const toggleLang = () => {
    const newLang = lang === "en" ? "ar" : "en";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      <div dir={lang === "ar" ? "rtl" : "ltr"} className={lang === "ar" ? "font-arabic" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
