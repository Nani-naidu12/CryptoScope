import { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import Account from "./routes/Account";
import axios from "axios";
import CoinPage from "./routes/CoinPage";
import StockPage from "./routes/StockPage";
import Footer from "./components/Footer";
import { AuthContextProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  // fetching coins from coingecko api
  const [coins, setCoins] = useState([]);

  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true";

  useEffect(() => {
    axios.get(url).then((response) => {
      setCoins(response.data);
      // console.log(response.data);
    });
  }, [url]);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthContextProvider>
          <Navbar />
          <Routes>
            {/* coins passed down to home component */}
            <Route path="/" element={<Home coins={coins} />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/account" element={<Account />} />
            <Route path="/stocks" element={<StockPage />} />
            <Route path="/coin/:coinId" element={<CoinPage />}>
              <Route path=":coinId" />
            </Route>
          </Routes>
          <Footer />
        </AuthContextProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
