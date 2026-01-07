export async function post(address, data) {
  let this_body = "";
  const backend_url = import.meta.env.VITE_BACKEND_URL || "";
  if (data) {
    this_body = JSON.stringify(data);
  }
  if (address) {
    const res = await fetch(`${backend_url}/api${address}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: this_body,
    });
    const result = await res.json();
    return result;
  }
}
// docker compose down
// cd ./frontend
// npm run build
// cd ..
