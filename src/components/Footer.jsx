import React from "react";
import { AiOutlineInstagram } from "react-icons/ai";
import { FaFacebook, FaTwitter, FaGithub } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import { useLanguage } from "../context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <div className="rounded-div mt-8 pt-8 text-primary">
      <div className="grid md:grid-cols-2">
        {/* Links */}
        <div className="flex justify-evenly w-full md:w-[300px] uppercase">
          <div>
            <h2 className="font-bold">{t("support")}</h2>
            <ul>
              <li className="text-sm py-2">{t("helpCenter")}</li>
              <li className="text-sm py-2">{t("contactUs")}</li>
              <li className="text-sm py-2">API</li>
              <li className="text-sm py-2">{t("documentation")}</li>
            </ul>
          </div>

          <div className="">
            <h2 className="font-bold">{t("info")}</h2>
            <ul>
              <li className="text-sm py-2">{t("aboutUs")}</li>
              <li className="text-sm py-2">{t("careers")}</li>
              <li className="text-sm py-2">{t("invest")}</li>
              <li className="text-sm py-2">{t("legal")}</li>
            </ul>
          </div>
        </div>

        {/* Socials */}
        <div className="text-right">
          <div className="w-full flex justify-end">
            <div className="w-full md:w-[300px] py-4 relative">
              <div className="flex justify-center md:justify-end py-4 md:py-0 md:pb-4 mt-[-1rem]">
                <ThemeToggle />
              </div>

              <p className="text-center md:text-right">{t("newsletter")}</p>

              <div className="py-4">
                <form>
                  <input
                    className="w-full bg-primary border border-input p-2 mr-2 rounded-2xl shadow-xl md:w-auto"
                    type="email"
                    placeholder={t("enterEmail")}
                    aria-label={t("email")}
                  />
                  <button className="w-full bg-button text-btnText px-4 p-2 rounded-2xl shadow-lg hover:shadow-2xl md:w-auto my-2">
                    {t("signUp")}
                  </button>
                </form>
              </div>

              <div className="flex py-4 justify-between text-accent">
                <FaGithub />
                <AiOutlineInstagram />
                <FaFacebook />
                <FaTwitter />
              </div>
            </div>
          </div>
        </div>
        {/*  */}
      </div>
      <p className="text-center py-4">{t("poweredBy")}</p>
    </div>
  );
};

export default Footer;
