const AdminUsersModule = {
    async render() {
        const app = document.getElementById('app');
        app.innerHTML = '<h2>Модерация пользователей</h2><div id="usersTable"><div class="spinner-border"></div></div>';
        await this.loadUsers();
    },
    async loadUsers() {
        const users = await API.admin.getUsers();
        let html = `<table class="table table-bordered"><thead class="table-dark">发展
            <th>ID</th><th>Логин</th><th>Email</th><th>Статус</th><th>Роль</th><th>Действия</th>
        </tr></thead><tbody>`;
        for (const u of users) {
            html += `<tr>
                <td>${u.id}</td>
                <td>${this.escape(u.username)}</td>
                <td>${this.escape(u.email)}</td>
                <td>${u.status}</td>
                <td>${u.role_name}</td>
                <td>`;
            if (u.status === 'pending') {
                html += `<button class="btn btn-sm btn-success approveBtn" data-id="${u.id}">Одобрить (дать права)</button>`;
            }
            else if (u.role_name === 'guest') {
                html += `<button class="btn btn-sm btn-primary makeOperatorBtn" data-id="${u.id}">Выдать права оператора</button>`;
            }
            else if (u.role_name === 'operator') {
                html += `
                    <button class="btn btn-sm btn-warning makeAdminBtn" data-id="${u.id}">Сделать админом</button>
                    <button class="btn btn-sm btn-danger revokeBtn" data-id="${u.id}">Забрать права</button>
                `;
            }
            else if (u.role_name === 'admin') {
                html += `<span class="text-muted">Администратор</span>`;
            }
            else {
                html += `<span class="text-muted">Нет действий</span>`;
            }

            html += `</td></tr>`;
        }
        html += `</tbody><table>`;
        document.getElementById('usersTable').innerHTML = html;

        document.querySelectorAll('.approveBtn').forEach(btn => btn.onclick = () => this.approveUser(btn.dataset.id));
        document.querySelectorAll('.makeOperatorBtn').forEach(btn => btn.onclick = () => this.makeOperator(btn.dataset.id));
        document.querySelectorAll('.makeAdminBtn').forEach(btn => btn.onclick = () => this.makeAdmin(btn.dataset.id));
        document.querySelectorAll('.revokeBtn').forEach(btn => btn.onclick = () => this.revokeOperator(btn.dataset.id));
    },
    async approveUser(id) {
        await API.admin.approveUser(id);
        this.loadUsers();
    },
    async makeOperator(id) {
        if (confirm('Выдать пользователю права оператора?')) {
            await API.admin.makeOperator(id);
            this.loadUsers();
        }
    },
    async makeAdmin(id) {
        if (confirm('Назначить пользователя администратором?')) {
            await API.admin.setRole(id, 'admin');
            this.loadUsers();
        }
    },
    async revokeOperator(id) {
        if (confirm('Лишить пользователя прав оператора? После этого он не сможет видеть отчёт.')) {
            await API.admin.revokeOperator(id);
            this.loadUsers();
        }
    },
    escape(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
    }
};