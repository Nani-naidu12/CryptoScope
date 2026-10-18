import React, { useState, useEffect } from "react";
import axios from "axios";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { FaTwitter, FaFacebook, FaReddit, FaGithub } from "react-icons/fa";
import DOMPurify from "dompurify";
import { useParams } from "react-router-dom";

const CoinPage = () => {
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const params = useParams();

  const url = `https://api.coingecko.com/api/v3/coins/${params.coinId}?localization=false&sparkline=true`;

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    axios
      .get(url)
      .then((response) => {
        if (!cancelled) {
          setCoin(response.data);
        }
      })
      .catch((requestError) => {
        console.error("Failed to load coin details:", requestError);
        if (!cancelled) {
          setError("Unable to load coin details. Please try again later.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  const formatCurrency = (value) =>
    Number.isFinite(value) ? `$${value.toLocaleString()}` : "—";
  const formatPercentage = (value) =>
    Number.isFinite(value) ? `${value.toFixed(2)}%` : "—";

  if (loading) {
    return <div className="rounded-div my-12 py-8">Loading coin details…</div>;
  }

  if (error) {
    return <div className="rounded-div my-12 py-8">{error}</div>;
  }

  if (!coin) {
    return (
      <div className="rounded-div my-12 py-8">
        Coin details are unavailable.
      </div>
    );
  }

  return (
    <div className="rounded-div my-12 py-8">
      <div className="flex py-8">
        <img className="w-20 mr-8" src={coin.image?.large} alt="/" />
        <div>
          <p className="font-bold text-3xl mt-2">{coin?.name} price</p>
          <p>({coin.symbol?.toUpperCase()} / USD)</p>
        </div>
      </div>

      {/* Market data */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between">
            {coin.market_data?.current_price ? (
              <p className="text-2xl font-bold">
                {formatCurrency(coin.market_data.current_price.usd)}
              </p>
            ) : null}
            <p>7 Days</p>
          </div>

          <div>
            <Sparklines data={coin.market_data?.sparkline_7d?.price || []}>
              <SparklinesLine color="teal" />
            </Sparklines>
          </div>

          <div className="flex justify-between py-4">
            <div>
              <p className="text-gray-500 text-sm">Market Cap</p>
              {coin.market_data?.market_cap ? (
                <p>{formatCurrency(coin.market_data.market_cap.usd)}</p>
              ) : null}
            </div>
            <div>
              <p className="text-gray-500 text-sm">Volume(24h)</p>
              {coin.market_data?.total_volume ? (
                <p>{formatCurrency(coin.market_data.total_volume.usd)}</p>
              ) : null}
            </div>
          </div>

          {/* 24h high-low */}
          <div className="flex justify-between py-4">
            <div>
              <p className="text-gray-500 text-sm">24h High</p>
              {coin.market_data?.high_24h ? (
                <p>{formatCurrency(coin.market_data.high_24h.usd)}</p>
              ) : null}
            </div>
            <div>
              <p className="text-gray-500 text-sm">24h Low</p>
              {coin.market_data?.low_24h ? (
                <p>{formatCurrency(coin.market_data.low_24h.usd)}</p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Market Stats */}
        <div>
          <p className="text-xl font-bold">Market Stats</p>
          <div className="flex justify-between py-4">
            <div>
              <p className="text-gray-500 text-sm">Market Rank</p>
              {coin.market_cap_rank ?? "—"}
            </div>
            <div>
              <p className="text-gray-500 text-sm">Hashing Algorithm</p>
              {coin.hashing_algorithm ? <p>{coin.hashing_algorithm}</p> : null}
            </div>
            <div>
              <p className="text-gray-500 text-sm">Trust Score</p>
              {Number.isFinite(coin.liquidity_score) ? (
                <p>{coin.liquidity_score.toFixed(2)}</p>
              ) : (
                <p>—</p>
              )}
            </div>
          </div>

          <div className="flex justify-between py-4">
            <div>
              <p className="text-gray-500 text-sm">Price Change (24h)</p>
              {coin.market_data ? (
                <p>
                  {formatPercentage(
                    coin.market_data.price_change_percentage_24h
                  )}
                </p>
              ) : null}
            </div>
            <div>
              <p className="text-gray-500 text-sm">Price Change (7d)</p>
              {coin.market_data ? (
                <p>
                  {formatPercentage(
                    coin.market_data.price_change_percentage_7d
                  )}
                </p>
              ) : null}
            </div>
            <div>
              <p className="text-gray-500 text-sm">Price Change (14d)</p>
              {coin.market_data ? (
                <p>
                  {formatPercentage(
                    coin.market_data.price_change_percentage_14d
                  )}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex justify-between py-4">
            <div>
              <p className="text-gray-500 text-sm">Price Change (30d)</p>
              {coin.market_data ? (
                <p>
                  {formatPercentage(
                    coin.market_data.price_change_percentage_30d
                  )}
                </p>
              ) : null}
            </div>
            <div>
              <p className="text-gray-500 text-sm">Price Change (60d)</p>
              {coin.market_data ? (
                <p>
                  {formatPercentage(
                    coin.market_data.price_change_percentage_60d
                  )}
                </p>
              ) : null}
            </div>
            <div>
              <p className="text-gray-500 text-sm">Price Change (1y)</p>
              {coin.market_data ? (
                <p>
                  {formatPercentage(
                    coin.market_data.price_change_percentage_1y
                  )}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex justify-evenly py-5 cursor-pointer text-accent">
            <FaTwitter />
            <FaFacebook />
            <FaReddit />
            <FaGithub />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="py-4">
        <p className="font-bold text-xl">About {coin.name}</p>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              coin.description ? coin.description.en : ""
            ),
          }}
        ></p>
      </div>
    </div>
  );
};

export default CoinPage;
