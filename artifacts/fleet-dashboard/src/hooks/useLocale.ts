import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { enUS, fr, ar } from "date-fns/locale";
import type { Locale } from "date-fns";
import { isRtl } from "../i18n";

const localeMap: Record<string, Locale> = {
  en: enUS,
  fr: fr,
  ar: ar,
};

export function useLocale() {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? i18n.language ?? "en";
  const dateFnsLocale = localeMap[lang] ?? enUS;
  const rtl = isRtl(lang);
  const dir: "ltr" | "rtl" = rtl ? "rtl" : "ltr";

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("dir", dir);
    root.setAttribute("lang", lang);
  }, [dir, lang]);

  const intlLocale = useMemo(() => {
    if (lang === "fr") return "fr-FR";
    if (lang === "ar") return "ar";
    return "en-US";
  }, [lang]);

  return { lang, dir, rtl, dateFnsLocale, intlLocale };
}
