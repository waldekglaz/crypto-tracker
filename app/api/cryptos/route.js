import { connectToDatabase } from "../../lib/mongodb";

export async function GET() {
  const { db } = await connectToDatabase();

  const cryptos = await db.collection("cryptos").find({}).toArray();

  return Response.json(
    cryptos.map(({ cryptoId, buyPrice, quantity }) => ({
      id: cryptoId,
      price: buyPrice,
      quantity,
    }))
  );
}

export async function POST(req) {
  const body = await req.json();
  const { cryptoId, buyPrice, quantity } = body;

  if (!cryptoId || !buyPrice || !quantity) {
    return new Response("Invalid input", { status: 400 });
  }

  const { db } = await connectToDatabase();

  await db.collection("cryptos").insertOne({
    cryptoId,
    buyPrice,
    quantity,
    createdAt: new Date(),
  });

  return new Response("OK");
}

export async function DELETE(req) {
  const body = await req.json();
  const { cryptoId } = body;

  if (!cryptoId) {
    return new Response("Missing cryptoId", { status: 400 });
  }

  const { db } = await connectToDatabase();

  const result = await db.collection("cryptos").deleteOne({ cryptoId });

  if (result.deletedCount === 0) {
    return new Response("Crypto not found", { status: 404 });
  }

  return new Response("Deleted", { status: 200 });
}
