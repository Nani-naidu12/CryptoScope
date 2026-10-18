import React, { useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

import CoinData from "./CoinData";

const getSortValue = (coin, key) => {
  if (key === "name" || key === "symbol") {
    return coin[key]?.toLowerCase() ?? null;
  }

  if (key === "change_7d") {
    const prices = coin.sparkline_in_7d?.price?.filter(Number.isFinite) ?? [];
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];

    return firstPrice > 0
      ? ((lastPrice - firstPrice) / firstPrice) * 100
      : null;
  }

  const values = {
    rank: coin.market_cap_rank,
    price: coin.current_price,
    change_24h: coin.price_change_percentage_24h,
    volume: coin.total_volume,
    market_cap: coin.market_cap,
  };

  return Number.isFinite(values[key]) ? values[key] : null;
};

const CoinSearch = ({ coins }) => {
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState({ key: "price", direction: "desc" });

  const visibleCoins = coins
    .filter((coin) =>
      coin.name.toLowerCase().includes(searchInput.toLowerCase())
    )
    .map((coin, index) => ({
      coin,
      index,
      value: getSortValue(coin, sort.key),
    }))
    .sort((a, b) => {
      if (a.value === null) return b.value === null ? a.index - b.index : 1;
      if (b.value === null) return -1;

      const comparison =
        typeof a.value === "string" && typeof b.value === "string"
          ? a.value.localeCompare(b.value)
          : a.value - b.value;

      return sort.direction === "asc"
        ? comparison || a.index - b.index
        : -comparison || a.index - b.index;
    })
    .map(({ coin }) => coin);

  const renderSortHeader = (label, key, className = "", defaultDirection = "desc") => {
    const isActive = sort.key === key;
    const direction = isActive ? sort.direction : defaultDirection;

    return (
      <th
        className={className}
        aria-sort={
          isActive ? (direction === "asc" ? "ascending" : "descending") : "none"
        }
      >
        <button
          type="button"
          aria-label={`Sort by ${label} ${
            direction === "asc" ? "descending" : "ascending"
          }`}
          className="inline-flex items-center"
          onClick={() =>
            setSort((current) =>
              current.key === key
                ? {
                    key,
                    direction: current.direction === "asc" ? "desc" : "asc",
                  }
                : { key, direction: defaultDirection }
            )
          }
        >
          {label}
          {isActive &&
            (direction === "asc" ? (
              <HiChevronUp aria-hidden="true" />
            ) : (
              <HiChevronDown aria-hidden="true" />
            ))}
        </button>
      </th>
    );
  };

  return (
    <div className="rounded-div my-4">
      <div className="flex flex-col md:flex-row justify-between pt-4 pb-6 text-center md:text-right">
        <h1 className="text-2xl font-bold my-2 ">Search Crypto</h1>
        <form>
          <input
            className="w-full bg-primary border border-input px-4 py-2 rounded-2xl shadow-xl"
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search"
          />
        </form>
      </div>

      <table className="w-full border-collapse text-center">
        <thead>
          <tr className="border-b">
            <th></th>
            {renderSortHeader("#", "rank", "px-4", "asc")}
            {renderSortHeader("Coin", "name", "text-left", "asc")}
            {renderSortHeader("Symbol", "symbol", "", "asc")}
            {renderSortHeader("Price", "price")}
            {renderSortHeader("24h", "change_24h")}
            {renderSortHeader("24h Volume", "volume", "hidden md:table-cell")}
            {renderSortHeader("Market", "market_cap", "hidden md:table-cell")}
            {renderSortHeader("Last 7 Days", "change_7d")}
          </tr>
        </thead>
        <tbody>
          {visibleCoins.map((coin) => (
            <CoinData key={coin.id} coin={coin} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoinSearch;
