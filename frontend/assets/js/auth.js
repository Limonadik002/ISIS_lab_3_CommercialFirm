const AUTH_API = 'http://localhost:8080/backend/api/auth';

async function register(username, email, password) {
    const res = await fetch(`${AUTH_API}/register.php`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, email, password})
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
}

async function login(login, password, rememberMe) {
    const res = await fetch(`${AUTH_API}/login.php`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({login, password, remember_me: rememberMe})
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
}

async function logout() {
    await fetch(`${AUTH_API}/logout.php`, {method: 'POST'});
    localStorage.removeItem('user');
    window.location.reload();
}

async function checkAuth() {
    const res = await fetch(`${AUTH_API}/check.php`);
    const data = await res.json();
    if (data.authenticated) {
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
    }
    localStorage.removeItem('user');
    return null;
}