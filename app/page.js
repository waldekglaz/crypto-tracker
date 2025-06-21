"use client";
import { useEffect, useState } from "react";
import CryptoSelector from "./components/CryptoSelector";
import { getCryptoPrices } from "./lib/coingeco";
import { formatPrice } from "./lib/formatPrice";

export default function Home() {
  const [selected, setSelected] = useState([]);
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const fetchSelectedCryptos = async () => {
      try {
        const res = await fetch("/api/cryptos");
        const data = await res.json();
        setSelected(data); // expects an array like [{ id, price, quantity }]
      } catch (err) {
        console.error("Error loading cryptos:", err);
      }
    };

    fetchSelectedCryptos();
  }, []);

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

  const handleDelete = async (cryptoId) => {
    try {
      const res = await fetch("/api/cryptos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cryptoId }),
      });

      if (!res.ok) throw new Error("Failed to delete crypto");

      // Re-fetch updated list from DB
      const updated = await fetch("/api/cryptos");
      const updatedData = await updated.json();
      setSelected(updatedData);
    } catch (err) {
      console.error("Error deleting crypto:", err);
    }
  };

  return (
    <main className="p-8 space-y-6  min-h-screen">
      <h1 className="text-3xl font-bold">Crypto Tracker</h1>

      <CryptoSelector
        onAdd={async (crypto) => {
          setSelected((prev) => [...prev, crypto]);
          try {
            const res = await fetch("/api/cryptos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                cryptoId: crypto.id,
                buyPrice: crypto.price,
                quantity: crypto.quantity,
              }),
            });

            if (!res.ok) throw new Error("Failed to save crypto");

            // ⏬ Re-fetch full list from DB
            const updated = await fetch("/api/cryptos");
            const updatedData = await updated.json();
            setSelected(updatedData);
          } catch (error) {
            console.error("Failed to save crypto:", error);
          }
        }}
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
                        onClick={() => handleDelete(crypto.id)}
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
