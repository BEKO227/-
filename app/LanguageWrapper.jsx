"use client";

import { useLanguage } from "./LanguageContext";

export default function LanguageWrapper({ children }) {
  const { lang } = useLanguage();

  return <div className={lang === "ar" ? "rtl" : "ltr"}>{children}</div>;
}
