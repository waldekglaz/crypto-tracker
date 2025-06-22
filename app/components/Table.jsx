import React from "react";
import { formatPrice } from "../lib/formatPrice";

const Table = ({ selected, prices, onDelete }) => {
  return (
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
                    onClick={() => onDelete(crypto.id)}
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
  );
};

export default Table;
