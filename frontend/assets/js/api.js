const API_BASE = 'http://localhost:8080/backend/api';

async function request(url, method = 'GET', data = null) {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (data) opts.body = JSON.stringify(data);
    const resp = await fetch(`${API_BASE}/${url}`, opts);
    const json = await resp.json();
    if (!resp.ok) throw new Error(json.error || 'Ошибка');
    return json;
}

const API = {
    clients: {
        getAll: () => request('clients.php'),
        get: (id) => request(`clients.php?id=${id}`),
        add: (data) => request('clients.php', 'POST', data),
        update: (id, data) => request(`clients.php?id=${id}`, 'PUT', data),
        delete: (id) => request(`clients.php?id=${id}`, 'DELETE')
    },
    employees: {
        getAll: () => request('employees.php'),
        get: (id) => request(`employees.php?id=${id}`),
        add: (data) => request('employees.php', 'POST', data),
        update: (id, data) => request(`employees.php?id=${id}`, 'PUT', data),
        delete: (id) => request(`employees.php?id=${id}`, 'DELETE')
    },
    suppliers: {
        getAll: () => request('suppliers.php'),
        get: (id) => request(`suppliers.php?id=${id}`),
        add: (data) => request('suppliers.php', 'POST', data),
        update: (id, data) => request(`suppliers.php?id=${id}`, 'PUT', data),
        delete: (id) => request(`suppliers.php?id=${id}`, 'DELETE')
    },
    pricelists: {
        getAll: () => request('pricelist.php'),
        get: (id) => request(`pricelist.php?id=${id}`),
        add: (data) => request('pricelist.php', 'POST', data),
        update: (id, data) => request(`pricelist.php?id=${id}`, 'PUT', data),
        delete: (id) => request(`pricelist.php?id=${id}`, 'DELETE')
    },
    models: {
        getAll: () => request('models.php'),
        get: (id) => request(`models.php?id=${id}`),
        add: (data) => request('models.php', 'POST', data),
        update: (id, data) => request(`models.php?id=${id}`, 'PUT', data),
        delete: (id) => request(`models.php?id=${id}`, 'DELETE'),
        getPricelistOptions: () => request('models.php?options=pricelist')
    },
    deals: {
        getAll: () => request('deals.php'),
        get: (id) => request(`deals.php?id=${id}`),
        add: (data) => request('deals.php', 'POST', data),
        update: (id, data) => request(`deals.php?id=${id}`, 'PUT', data),
        delete: (id) => request(`deals.php?id=${id}`, 'DELETE'),
        getClientOptions: () => request('deals.php?options=clients'),
        getEmployeeOptions: () => request('deals.php?options=employees')
    },
    supplieroffers: {
        getAll: () => request('supplieroffer.php'),
        get: (id) => request(`supplieroffer.php?id=${id}`),
        add: (data) => request('supplieroffer.php', 'POST', data),
        update: (id, data) => request(`supplieroffer.php?id=${id}`, 'PUT', data),
        delete: (id) => request(`supplieroffer.php?id=${id}`, 'DELETE'),
        getModelOptions: () => request('supplieroffer.php?options=models'),
        getSupplierOptions: () => request('supplieroffer.php?options=suppliers')
    },
    modelsindeal: {
        getAll: () => request('modelsindeal.php'),
        get: (id) => request(`modelsindeal.php?id=${id}`),
        add: (data) => request('modelsindeal.php', 'POST', data),
        update: (id, data) => request(`modelsindeal.php?id=${id}`, 'PUT', data),
        delete: (id) => request(`modelsindeal.php?id=${id}`, 'DELETE'),
        getModelOptions: () => request('modelsindeal.php?options=models'),
        getDealOptions: () => request('modelsindeal.php?options=deals')
    },
    report: {
        get: (month, year) => {
            let url = 'report.php';
            if (month && year) url += `?month=${month}&year=${year}`;
            return request(url);
        }
    }
};