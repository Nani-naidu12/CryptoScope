import React from "react";
import WatchList from "../components/WatchList";
import { UserAuth } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const Account = () => {
  const { user, userSignOut } = UserAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await userSignOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  // Protective route
  if (user) {
    return (
      <div className="max-w-[1140px] mx-auto">
        <div className="rounded-div flex justify-between items-center my-12 py-8">
          <div>
            <h1 className="text-2xl font-bold">{t("account")}</h1>
            <div>
              <p>{t("welcome", { email: user?.email })}</p>
            </div>
          </div>
          <div>
            <button
              onClick={handleSignOut}
              className="border px-6 py-2 rounded-2xl shadow-lg hover:shadow-2xl"
            >
              {t("signOut")}
            </button>
          </div>
        </div>
        <div className="rounded-div flex justify-between items-center my-12 py-8">
          <div className="w-full min-h-[300px]">
            <h1 className="text-2xl font-bold py-4">{t("watchlist")}</h1>
            <WatchList />
          </div>
        </div>
      </div>
    );
  } else {
    return <Navigate to="/signin" />;
  }
};

export default Account;
