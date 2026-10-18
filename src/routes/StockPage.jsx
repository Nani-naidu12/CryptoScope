import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";

const popularSymbols = [
  { exchange: "NASDAQ", symbol: "AAPL" },
  { exchange: "NASDAQ", symbol: "MSFT" },
  { exchange: "NASDAQ", symbol: "NVDA" },
  { exchange: "NASDAQ", symbol: "GOOGL" },
  { exchange: "NYSE", symbol: "JPM" },
];

const StockPage = () => {
  const { theme } = useContext(ThemeContext);
  const [exchange, setExchange] = useState("NASDAQ");
  const [symbol, setSymbol] = useState("AAPL");
  const [chartSymbol, setChartSymbol] = useState("NASDAQ:AAPL");
  const [error, setError] = useState("");

  const chartUrl = new URL("https://www.tradingview.com/widgetembed/");
  chartUrl.search = new URLSearchParams({
    symbol: chartSymbol,
    interval: "D",
    hidesidetoolbar: "1",
    allow_symbol_change: "1",
    saveimage: "0",
    theme: theme === "dark" ? "dark" : "light",
    style: "1",
    timezone: "Etc/UTC",
    withdateranges: "1",
    hideideas: "1",
    locale: "en",
  }).toString();

  const showStock = (requestedSymbol, requestedExchange = exchange) => {
    const normalizedSymbol = requestedSymbol.trim().toUpperCase();

    if (!/^[A-Z0-9.-]{1,15}$/.test(normalizedSymbol)) {
      setError("Enter a valid stock ticker, such as AAPL or BRK.B.");
      return;
    }

    setError("");
    setSymbol(normalizedSymbol);
    setExchange(requestedExchange);
    setChartSymbol(`${requestedExchange}:${normalizedSymbol}`);
  };

  return (
    <main className="rounded-div my-12 py-8">
      <h1 className="text-3xl font-bold">Stock Market</h1>
      <p className="mt-2 text-secondary">
        Search a stock symbol to view its interactive market chart.
      </p>

      <form
        className="my-6 flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          showStock(symbol);
        }}
      >
        <label className="sr-only" htmlFor="stock-exchange">
          Stock exchange
        </label>
        <select
          id="stock-exchange"
          className="rounded-2xl border border-input bg-primary px-4 py-3"
          onChange={(event) => setExchange(event.target.value)}
          value={exchange}
        >
          <option value="NASDAQ">NASDAQ</option>
          <option value="NYSE">NYSE</option>
          <option value="AMEX">AMEX</option>
        </select>
        <label className="sr-only" htmlFor="stock-symbol">
          Stock symbol
        </label>
        <input
          id="stock-symbol"
          className="w-full rounded-2xl border border-input bg-primary px-4 py-3 sm:max-w-sm"
          autoComplete="off"
          maxLength={15}
          onChange={(event) => setSymbol(event.target.value.toUpperCase())}
          placeholder="Enter a symbol, e.g. AAPL"
          value={symbol}
        />
        <button
          className="rounded-2xl bg-button px-5 py-3 font-bold text-btnText"
          type="submit"
        >
          View chart
        </button>
      </form>

      <div className="mb-6">
        <p className="mb-3 font-semibold">Popular stocks</p>
        <div className="flex flex-wrap gap-2">
          {popularSymbols.map((stock) => (
            <button
              key={`${stock.exchange}:${stock.symbol}`}
              className="rounded-xl border border-secondary px-4 py-2 hover:border-accent"
              onClick={() => showStock(stock.symbol, stock.exchange)}
              type="button"
            >
              {stock.symbol}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-red-500 p-4 text-red-600" role="alert">
          {error}
        </p>
      )}

      <section aria-label={`${chartSymbol} stock chart`}>
        <h2 className="mb-3 text-xl font-bold">{chartSymbol}</h2>
        <iframe
          key={chartSymbol + theme}
          title={`${chartSymbol} interactive stock chart`}
          src={chartUrl.toString()}
          className="h-[500px] w-full rounded-xl border-0"
          loading="lazy"
          referrerPolicy="origin"
          allowFullScreen
        />
      </section>

      <p className="mt-4 text-sm text-secondary">
        Charts are provided by{" "}
        <a
          className="text-accent underline"
          href={`https://www.tradingview.com/symbols/${encodeURIComponent(
            chartSymbol
          )}/`}
          target="_blank"
          rel="noreferrer"
        >
          TradingView
        </a>
        . Market data availability and delay depend on the exchange.
      </p>
    </main>
  );
};

export default StockPage;
