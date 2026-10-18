import React, { useState } from "react";
import { AiOutlineMail, AiFillLock } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { signUp } = UserAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    try {
      await signUp(email, password);
      navigate("/account");
    } catch (err) {
      setError(err.message);
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="max-w-[400px] mx-auto min-h-[600px] px-4 py-20">
        <h1 className="text-2xl font-bold">{t("signUp")}</h1>

        {error ? <p className="bg-red-300 p-3 my-2">{error}</p> : null}

        <form onSubmit={handleSubmit}>
          <div className="my-4">
            <label>{t("email")}</label>
            <div className="relative my-2 w-full rounded-2xl shadow-2xl">
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 bg-primary border border-input rounded-2xl"
                type="email"
              />
              <AiOutlineMail className="absolute right-2 top-3 text-gray-400" />
            </div>
          </div>

          <div className="my-4">
            <label>{t("password")}</label>
            <div className="relative my-2 w-full rounded-2xl shadow-2xl">
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 bg-primary border border-input rounded-2xl"
                type="password"
              />
              <AiFillLock className="absolute right-2 top-3 text-gray-400" />
            </div>
          </div>
          <button className="w-full bg-button text-btnText my-2 p-3 rounded-2xl shadow-lg hover:shadow-2xl">
            {t("signUp")}
          </button>
        </form>
        <p className="my-4">
          {t("alreadyHaveAccount")}{" "}
          <Link className="text-accent" to="/signup">
            {t("signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
