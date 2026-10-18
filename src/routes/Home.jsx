import React from "react";
import { Link } from "react-router-dom";
import CoinSearch from "../components/CoinSearch";
import StockSearch from "../components/StockSearch";
import Trending from "../components/Trending";

const Home = ({ coins }) => {
  return (
    <div>
      <section className="rounded-div my-4 flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Explore the stock market</h1>
          <p className="mt-2 text-secondary">
            Search US stock symbols and view their latest quotes.
          </p>
        </div>
        <Link
          to="/stocks"
          className="rounded-2xl bg-button px-5 py-3 font-bold text-btnText"
        >
          Explore stocks
        </Link>
      </section>
      <StockSearch />
      <CoinSearch coins={coins} />
      <Trending />
    </div>
  );
};

export default Home;
