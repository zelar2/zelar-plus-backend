// ZELAR+ — API da sandbox (mesmo contrato do backend)
const API_URL = "http://localhost:3000/api";

export async function getUsuarios() {
  const r = await fetch(`${API_URL}/usuarios`);
  return r.json();
}

export default API_URL;