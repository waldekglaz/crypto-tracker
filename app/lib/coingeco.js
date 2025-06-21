export async function getCryptoPrices(ids) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(
    ","
  )}&vs_currencies=usd`;
  const res = await fetch(url);
  return res.json();
}
