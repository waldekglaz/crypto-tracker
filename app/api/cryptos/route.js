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
