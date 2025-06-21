import mongoose from "mongoose";

const CryptoSchema = new mongoose.Schema({
  userId: String,
  cryptoId: String,
  buyPrice: Number,
  quantity: Number,
  addedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Crypto || mongoose.model("Crypto", CryptoSchema);
