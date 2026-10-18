import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { useLanguage } from "../context/LanguageContext";

const scannerUrl = "https://scanner.tradingview.com/america/scan";
const columns = [
  "name",
  "description",
  "close",
  "change",
  "volume",
  "market_cap_basic",
  "currency",
  "exchange",
];

const getSortValue = (stock, key) => {
  if (key === "symbol" || key === "company") {
    return stock[key]?.toLowerCase() ?? null;
  }

  return Number.isFinite(stock[key]) ? stock[key] : null;
};

const formatCurrency = (value, currency = "USD", locale = "en-US") =>
  Number.isFinite(value)
    ? value.toLocaleString(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: value < 1 ? 6 : 2,
      })
    : "—";

const formatCompactNumber = (value, locale = "en-US") =>
  Number.isFinite(value)
    ? value.toLocaleString(locale, {
        notation: "compact",
        maximumFractionDigits: 2,
      })
    : "—";

const StockSearch = () => {
  const { t, language } = useLanguage();
  const [stocks, setStocks] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState({ key: "marketCap", direction: "desc" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchStocks = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.post(
          scannerUrl,
          JSON.stringify({
            filter: [{ left: "type", operation: "equal", right: "stock" }],
            options: { lang: "en" },
            markets: ["america"],
            symbols: { query: { types: [] }, tickers: [] },
            columns,
            sort: { sortBy: "market_cap_basic", sortOrder: "desc" },
            range: [0, 100],
          }),
          {
            signal: controller.signal,
            headers: { "Content-Type": "text/plain;charset=UTF-8" },
          }
        );

        if (!Array.isArray(response.data?.data)) {
          throw new Error("The stock provider returned an unexpected response.");
        }

        const parsedStocks = response.data.data
          .map((row) => {
            const [
              symbol,
              company,
              price,
              change,
              volume,
              marketCap,
              currency,
              exchange,
            ] = row.d ?? [];
            const match = /^([A-Z0-9.-]+):([A-Z0-9.-]+)$/.exec(row.s ?? "");

            if (!match || typeof symbol !== "string") {
              return null;
            }

            return {
              id: row.s,
              exchange: exchange || match[1],
              symbol,
              company: company || symbol,
              price,
              change,
              volume,
              marketCap,
              currency: currency || "USD",
            };
          })
          .filter(Boolean);

        setStocks(parsedStocks);
      } catch (requestError) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("Failed to load stock market data:", requestError);
        setError(
          t("stockDataError")
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchStocks();
    return () => controller.abort();
  }, [retry, t]);

  const visibleStocks = useMemo(
    () =>
      stocks
        .filter((stock) => {
          const searchTerm = searchInput.trim().toLowerCase();
          return (
            stock.symbol.toLowerCase().includes(searchTerm) ||
            stock.company.toLowerCase().includes(searchTerm)
          );
        })
        .map((stock, index) => ({
          stock,
          index,
          value: getSortValue(stock, sort.key),
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
        .map(({ stock }) => stock),
    [searchInput, sort, stocks]
  );

  const renderSortHeader = (labelKey, key, defaultDirection = "desc") => {
    const isActive = sort.key === key;
    const direction = isActive ? sort.direction : defaultDirection;
    const label = t(labelKey);

    return (
      <th
        key={key}
        aria-sort={
          isActive ? (direction === "asc" ? "ascending" : "descending") : "none"
        }
        className="whitespace-nowrap px-3 py-3"
      >
        <button
          type="button"
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
    <section className="rounded-div my-4 py-4">
      <div className="flex flex-col justify-between gap-3 px-4 pb-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold">{t("searchStocks")}</h2>
          <p className="mt-1 text-sm text-secondary">
            {t("stocksSearchDescription")}
          </p>
        </div>
        <label className="sr-only" htmlFor="stock-search">
          {t("searchStocksLabel")}
        </label>
        <input
          id="stock-search"
          className="w-full rounded-2xl border border-input bg-primary px-4 py-2 sm:max-w-xs"
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder={t("searchTickerOrCompany")}
          type="search"
          value={searchInput}
        />
      </div>

      {loading && (
        <p className="px-4 py-6 text-secondary" role="status">
          {t("loadingStockData")}
        </p>
      )}

      {error && (
        <div className="mx-4 my-4 rounded-xl border border-red-500 p-4 text-red-600">
          <p role="alert">{error}</p>
          <button
            className="mt-2 font-semibold underline"
            onClick={() => setRetry((count) => count + 1)}
            type="button"
          >
            {t("retry")}
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b">
                {renderSortHeader("symbol", "symbol", "asc")}
                {renderSortHeader("company", "company", "asc")}
                {renderSortHeader("price", "price")}
                {renderSortHeader("change", "change")}
                {renderSortHeader("volume", "volume")}
                {renderSortHeader("marketCap", "marketCap")}
              </tr>
            </thead>
            <tbody>
              {visibleStocks.map((stock) => (
                <tr className="h-16 border-b" key={stock.id}>
                  <td className="whitespace-nowrap px-3 py-2 font-bold">
                    <a
                      className="hover:text-accent"
                      href={`https://www.tradingview.com/symbols/${encodeURIComponent(
                        stock.id
                      )}/`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {stock.symbol}
                    </a>
                  </td>
                  <td className="min-w-48 px-3 py-2">{stock.company}</td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {formatCurrency(
                      stock.price,
                      stock.currency,
                      language === "kn" ? "kn-IN" : "en-US"
                    )}
                  </td>
                  <td
                    className={`whitespace-nowrap px-3 py-2 font-semibold ${
                      Number.isFinite(stock.change) && stock.change >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {Number.isFinite(stock.change)
                      ? `${stock.change > 0 ? "+" : ""}${stock.change.toFixed(
                          2
                        )}%`
                      : "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {formatCompactNumber(
                      stock.volume,
                      language === "kn" ? "kn-IN" : "en-US"
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {formatCurrency(
                      stock.marketCap,
                      stock.currency,
                      language === "kn" ? "kn-IN" : "en-US"
                    )}
                  </td>
                </tr>
              ))}
              {visibleStocks.length === 0 && (
                <tr>
                  <td className="px-3 py-8 text-center text-secondary" colSpan="6">
                    {t("noStocksMatch")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="px-4 pt-3 text-xs text-secondary">
        {t("stockDataCredit")}
      </p>
    </section>
  );
};

export default StockSearch;
