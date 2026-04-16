const API_BASE = 'http://localhost:8080/backend/api';

async function request(url, method = 'GET', data = null) {
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    if (data) options.body = JSON.stringify(data);
    const resp = await fetch(`${API_BASE}/${url}`, options);
    const json = await resp.json();
    if (!resp.ok) throw new Error(json.error || 'Ошибка запроса');
    return json;
}

const API = {
    clients: {
        getAll: () => request('clients.php'),
        get: (id) => request(`clients.php?id=${id}`),
        add: (data) => request('clients.php', 'POST', data),
        update: (id, data) => request(`clients.php?id=${id}`, 'PUT', data),
        delete: (id) => request(`clients.php?id=${id}`, 'DELETE')
    }
};