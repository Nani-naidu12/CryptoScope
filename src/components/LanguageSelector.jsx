import React from "react";
import { useLanguage } from "../context/LanguageContext";

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <label className="flex items-center gap-2">
      <span className="sr-only">{t("language")}</span>
      <select
        aria-label={t("language")}
        className="rounded-xl border border-secondary bg-primary px-2 py-2 text-sm text-primary"
        onChange={(event) => setLanguage(event.target.value)}
        value={language}
      >
        <option value="en">{t("english")}</option>
        <option value="kn">{t("kannada")}</option>
        <option value="hi">{t("hindi")}</option>
        <option value="te">{t("telugu")}</option>
      </select>
    </label>
  );
};

export default LanguageSelector;
