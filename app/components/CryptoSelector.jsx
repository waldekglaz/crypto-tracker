import { useState, useRef } from "react";
import { availableCryptos } from "./const/consts";

export default function CryptoSelector({ onAdd }) {
  const [selectedId, setSelectedId] = useState(availableCryptos[0].id);
  const priceRef = useRef();
  const quantityRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    const buyPrice = parseFloat(priceRef.current.value);
    const quantity = parseFloat(quantityRef.current.value);
    if (!buyPrice || buyPrice <= 0 || !quantity || quantity <= 0) return;

    onAdd({ id: selectedId, price: buyPrice, quantity });

    // Clear the input after adding
    priceRef.current.value = "";
    quantityRef.current.value = "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-4 items-end  p-4 rounded shadow"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Crypto
        </label>
        <select
          className="border p-2 rounded"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {availableCryptos.map((crypto) => (
            <option key={crypto.id} value={crypto.id}>
              {crypto.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Buy Price (USD)
        </label>
        <input
          type="number"
          step="0.000000000001"
          min="0"
          ref={priceRef}
          className="border p-2 rounded"
          placeholder="Enter buy price"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <input
          type="number"
          step="0.00000001"
          min="0"
          ref={quantityRef}
          className="border p-2 rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add
      </button>
    </form>
  );
}
