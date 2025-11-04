// services/api.js
export const API_URL = 'http://192.168.0.100/api'; // ajuste para seu IP/local

export async function getData(endpoint) {
  const res = await fetch(`${API_URL}/${endpoint}`);
  return await res.json();
}

export async function postData(endpoint, payload) {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  return await res.json();
}
