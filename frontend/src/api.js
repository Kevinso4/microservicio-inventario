const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

async function handleResponse(res) {
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = body?.error || `Error HTTP ${res.status}`;
    throw new Error(message);
  }

  return body;
}

export async function obtenerInventario(productoId) {
  const res = await fetch(`${API_URL}/inventario/${encodeURIComponent(productoId)}`);
  return handleResponse(res);
}

export async function obtenerBajoStock() {
  const res = await fetch(`${API_URL}/inventario/bajo-stock`);
  return handleResponse(res);
}

export async function crearInventario(payload) {
  const res = await fetch(`${API_URL}/inventario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function aumentarInventario(productoId, cantidad) {
  const res = await fetch(`${API_URL}/inventario/${encodeURIComponent(productoId)}/aumentar`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cantidad }),
  });
  return handleResponse(res);
}

export async function disminuirInventario(productoId, cantidad) {
  const res = await fetch(`${API_URL}/inventario/${encodeURIComponent(productoId)}/disminuir`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cantidad }),
  });
  return handleResponse(res);
}

export async function eliminarInventario(productoId) {
  const res = await fetch(`${API_URL}/inventario/${encodeURIComponent(productoId)}`, {
    method: 'DELETE',
  });
  if (res.status === 204) return null;
  return handleResponse(res);
}
