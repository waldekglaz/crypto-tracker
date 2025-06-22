"use client";
import { useEffect, useState } from "react";
import { getCryptoPrices } from "./lib/coingeco";
import CryptoSelector from "./components/CryptoSelector";
import Table from "./components/Table";

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

  const handleLogout = async () => {
    await fetch("api/logout", {
      method: "POST",
    });
    window.location.href = "/login";
  };

  return (
    <main className="p-8 space-y-6  min-h-screen">
      <button onClick={handleLogout}>Logout</button>
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
      {selected.length > 0 ? (
        <Table selected={selected} prices={prices} onDelete={handleDelete} />
      ) : (
        "You have no crypto yet"
      )}
    </main>
  );
}
