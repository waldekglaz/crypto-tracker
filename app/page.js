"use client";
import { useEffect, useState } from "react";
import CryptoSelector from "./components/CryptoSelector";
import { getCryptoPrices } from "./lib/coingeco";
import { formatPrice } from "./lib/formatPrice";

export default function Home() {
  const [selected, setSelected] = useState([]);
  const [prices, setPrices] = useState({});

  // Load from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem("crypto-tracker");
    if (stored) {
      setSelected(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever selected changes
  useEffect(() => {
    localStorage.setItem("crypto-tracker", JSON.stringify(selected));
  }, [selected]);

  // Fetch current prices
  useEffect(() => {
    const fetchPrices = async () => {
      if (selected.length === 0) return;

      const ids = selected.map((crypto) => crypto.id);
      const res = await getCryptoPrices(ids);
      const updatedPrices = {};
      ids.forEach((id) => {
        updatedPrices[id] = res[id]?.usd || 0;
      });
      setPrices(updatedPrices);
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // refresh every 30 seconds
    return () => clearInterval(interval);
  }, [selected]);

  const handleDelete = (index) => {
    setSelected((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <main className="p-8 space-y-6  min-h-screen">
      <h1 className="text-3xl font-bold">Crypto Tracker</h1>

      <CryptoSelector
        onAdd={(crypto) => setSelected((prev) => [...prev, crypto])}
      />

      {selected.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border  rounded shadow mt-6">
            <thead className="">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Buy Price</th>
                <th className="text-left p-3">Current Price</th>
                <th className="text-left p-3">Quantity</th>
                <th className="text-left p-3">Difference</th>
                <th className="text-left p-3">Profit/Loss</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {selected.map((crypto, index) => {
                const currentPrice = prices[crypto.id] || 0;
                const difference = currentPrice - crypto.price;
                const percent = ((difference / crypto.price) * 100).toFixed(2);
                const isGain = difference >= 0;
                const profitLoss = crypto.quantity * difference;

                return (
                  <tr key={crypto.id + crypto.price} className="border-t">
                    <td className="p-3 capitalize">
                      {crypto.id.replace(/-/g, " ")}
                    </td>
                    <td className="p-3">${formatPrice(crypto.price)}</td>
                    <td className="p-3">${formatPrice(currentPrice)}</td>
                    <td className="p-3">{crypto.quantity}</td>
                    <td
                      className={`p-3 ${
                        isGain ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isGain ? "+" : ""}${formatPrice(difference)} ({percent}%)
                    </td>
                    <td
                      className={`p-3 ${
                        isGain ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isGain ? "+" : ""}${formatPrice(profitLoss)}
                    </td>
                    <td className="p-3">
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(index)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
