let currentUser = null;
let pages = {};

async function init() {
    currentUser = await checkAuth();
    buildMenu();
    pages = {
        home: () => renderHome(),
        login: () => renderLogin(),
        register: () => renderRegister()
    };
    if (currentUser) {
        if (currentUser.role_name === 'admin') {
            pages.clients = () => ClientsModule.render();
            pages.employees = () => EmployeesModule.render();
            pages.suppliers = () => SuppliersModule.render();
            pages.pricelists = () => PricelistsModule.render();
            pages.models = () => CarModelsModule.render();
            pages.deals = () => DealsModule.render();
            pages.supplieroffers = () => SupplierOffersModule.render();
            pages.modelsindeal = () => ModelsInDealModule.render();
            pages.report = () => ReportModule.render();
            pages.admin_users = () => AdminUsersModule.render();
            const msg = (currentUser.login_count === 1)
                ? 'Добро пожаловать!'
                : `Вы зашли в ${currentUser.login_count} раз. Последнее посещение: ${currentUser.last_login}`;
            setTimeout(() => alert(msg), 100);
        } else if (currentUser.role_name === 'operator') {
            pages.report = () => ReportModule.render();
            const msg = (currentUser.login_count === 1)
                ? 'Добро пожаловать!'
                : `Вы зашли в ${currentUser.login_count} раз. Последнее посещение: ${currentUser.last_login}`;
            setTimeout(() => alert(msg), 100);
        }
    }
    const hash = window.location.hash.slice(1) || 'home';
    loadPage(hash);
}

function buildMenu() {
    const navMenu = document.getElementById('navMenu');
    const authButtons = document.getElementById('authButtons');
    navMenu.innerHTML = '';
    authButtons.innerHTML = '';
    if (currentUser) {
        if (currentUser.role_name === 'admin') {
            addNavItem('Клиенты', 'clients');
            addNavItem('Сотрудники', 'employees');
            addNavItem('Поставщики', 'suppliers');
            addNavItem('Прайс-лист', 'pricelists');
            addNavItem('Модели', 'models');
            addNavItem('Сделки', 'deals');
            addNavItem('Предложения', 'supplieroffers');
            addNavItem('Позиции', 'modelsindeal');
            addNavItem('Отчёт', 'report');
            addNavItem('Модерация', 'admin_users');
        } else if (currentUser.role_name === 'operator') {
            addNavItem('Отчёт', 'report');
            const span = document.createElement('span');
            span.className = 'navbar-text mx-3 text-warning';
            span.innerText = 'Режим оператора активен';
            navMenu.appendChild(span);
        }
        authButtons.innerHTML = `<span class="navbar-text me-3">${currentUser.username}</span><button class="btn btn-outline-light" id="logoutBtn">Выйти</button>`;
        document.getElementById('logoutBtn').onclick = () => logout();
    } else {
        addNavItem('Главная', 'home');
        authButtons.innerHTML = `<button class="btn btn-outline-light me-2" id="loginBtn">Вход</button><button class="btn btn-primary" id="registerBtn">Регистрация</button>`;
        document.getElementById('loginBtn').onclick = () => loadPage('login');
        document.getElementById('registerBtn').onclick = () => loadPage('register');
    }
}

function addNavItem(text, page) {
    const li = document.createElement('li');
    li.className = 'nav-item';
    const a = document.createElement('a');
    a.className = 'nav-link';
    a.href = '#';
    a.innerText = text;
    a.onclick = (e) => { e.preventDefault(); loadPage(page); };
    li.appendChild(a);
    navMenu.appendChild(li);
}

function loadPage(page) {
    if (pages[page]) {
        pages[page]();
        window.location.hash = page;
    } else {
        document.getElementById('app').innerHTML = '<h2>Страница не найдена или доступ запрещён</h2>';
    }
}

function renderHome() {
    document.getElementById('app').innerHTML = `
        <div class="jumbotron">
            <h1>Добро пожаловать в АвтоМир</h1>
            <p>Коммерческая фирма по продаже автомобилей</p>
            <p>Разработчик: Студент ...</p>
            ${!currentUser ? '<p>Пожалуйста, <a href="#" id="loginLink">войдите</a> или <a href="#" id="registerLink">зарегистрируйтесь</a></p>' : ''}
        </div>
    `;
    if (!currentUser) {
        document.getElementById('loginLink')?.addEventListener('click', (e) => { e.preventDefault(); loadPage('login'); });
        document.getElementById('registerLink')?.addEventListener('click', (e) => { e.preventDefault(); loadPage('register'); });
    }
}

async function renderLogin() {
    document.getElementById('app').innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-4">
                <h2>Вход</h2>
                <div id="errorMsg" class="alert alert-danger" style="display:none"></div>
                <form id="loginForm">
                    <div class="mb-2"><label>Логин или Email</label><input name="login" class="form-control" required></div>
                    <div class="mb-2"><label>Пароль</label><input type="password" name="password" class="form-control" required></div>
                    <div class="mb-2 form-check"><input type="checkbox" class="form-check-input" id="remember"><label class="form-check-label">Запомнить меня</label></div>
                    <button type="submit" class="btn btn-primary">Войти</button>
                </form>
            </div>
        </div>
    `;
    const form = document.getElementById('loginForm');
    form.onsubmit = async (e) => {
        e.preventDefault();
        const errDiv = document.getElementById('errorMsg');
        errDiv.style.display = 'none';
        try {
            const result = await login(form.login.value, form.password.value, document.getElementById('remember').checked);
            if (result.user.role_name === 'admin') {
                window.location.hash = 'clients';
            } else if (result.user.role_name === 'operator') {
                window.location.hash = 'report';
            } else {
                window.location.hash = 'home';
            }
            window.location.reload();
        } catch (err) {
            errDiv.style.display = 'block';
            errDiv.innerText = err.message;
        }
    };
}

function renderRegister() {
    document.getElementById('app').innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-4">
                <h2>Регистрация</h2>
                <div id="errorMsg" class="alert alert-danger" style="display:none"></div>
                <form id="registerForm">
                    <div class="mb-2"><label>Логин*</label><input name="username" class="form-control" required></div>
                    <div class="mb-2"><label>Email*</label><input type="email" name="email" class="form-control" required></div>
                    <div class="mb-2"><label>Пароль* (не менее 6 символов)</label><input type="password" name="password" class="form-control" required></div>
                    <button type="submit" class="btn btn-primary">Зарегистрироваться</button>
                </form>
            </div>
        </div>
    `;
    const form = document.getElementById('registerForm');
    form.onsubmit = async (e) => {
        e.preventDefault();
        const errDiv = document.getElementById('errorMsg');
        errDiv.style.display = 'none';
        try {
            await register(form.username.value, form.email.value, form.password.value);
            alert('Регистрация успешна. После подтверждения администратором вы сможете войти.');
            loadPage('login');
        } catch (err) {
            errDiv.style.display = 'block';
            errDiv.innerText = err.message;
        }
    };
}

init();