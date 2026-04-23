const EmployeesModule = {
    async render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <h2>Сотрудники</h2>
            <button class="btn btn-primary mb-3" id="addBtn">+ Добавить</button>
            <div id="tableContainer"><div class="spinner-border"></div></div>
            <div id="modalContainer"></div>
        `;
        await this.loadTable();
        document.getElementById('addBtn').onclick = () => this.showForm();
    },

    async loadTable() {
        const list = await API.employees.getAll();
        let html = `<table class="table table-bordered"><thead class="table-dark">
            <th>Фамилия</th><th>Имя</th><th>Отчество</th><th>Телефон</th><th>Действия</th>
        </tr></thead><tbody>`;
        for (const e of list) {
            html += `<tr>
                <td>${this.escape(e.LastName)}</td>
                <td>${this.escape(e.FirstName)}</td>
                <td>${this.escape(e.MiddleName || '—')}</td>
                <td>${this.escape(e.Phone)}</td>
                <td>
                    <button class="btn btn-sm btn-warning editBtn" data-id="${e.Employee_ID}">✏️</button>
                    <button class="btn btn-sm btn-danger deleteBtn" data-id="${e.Employee_ID}">🗑️</button>
                </td>
            </tr>`;
        }
        html += `</tbody></table>`;
        document.getElementById('tableContainer').innerHTML = html;
        document.querySelectorAll('.editBtn').forEach(btn => btn.onclick = () => this.showForm(btn.dataset.id));
        document.querySelectorAll('.deleteBtn').forEach(btn => btn.onclick = () => this.deleteItem(btn.dataset.id));
    },

    async showForm(id = null) {
        const isEdit = !!id;
        let data = {};
        if (isEdit) data = await API.employees.get(id);
        const modalHtml = `
            <div class="modal fade" id="empModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5>${isEdit ? 'Редактировать' : 'Добавить'} сотрудника</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div id="formError" class="alert alert-danger" style="display:none;"></div>
                            <form id="empForm">
                                <div class="mb-2"><label>Фамилия *</label><input name="LastName" class="form-control" value="${this.escape(data.LastName)}" required></div>
                                <div class="mb-2"><label>Имя *</label><input name="FirstName" class="form-control" value="${this.escape(data.FirstName)}" required></div>
                                <div class="mb-2"><label>Отчество</label><input name="MiddleName" class="form-control" value="${this.escape(data.MiddleName)}"></div>
                                <div class="mb-2"><label>Телефон *</label><input name="Phone" class="form-control" value="${this.escape(data.Phone)}" required></div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                            <button class="btn btn-primary" id="saveBtn">Сохранить</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('modalContainer').innerHTML = modalHtml;
        const modal = new bootstrap.Modal(document.getElementById('empModal'));
        modal.show();

        const errorDiv = document.getElementById('formError');
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.onclick = async () => {
            errorDiv.style.display = 'none';
            const form = document.getElementById('empForm');
            const formData = {
                LastName: form.LastName.value,
                FirstName: form.FirstName.value,
                MiddleName: form.MiddleName.value,
                Phone: form.Phone.value
            };
            try {
                if (isEdit) await API.employees.update(id, formData);
                else await API.employees.add(formData);
                modal.hide();
                await this.loadTable();
            } catch (err) {
                errorDiv.style.display = 'block';
                errorDiv.innerText = err.message;
            }
        };
    },

    async deleteItem(id) {
        if (confirm('Удалить сотрудника?')) {
            await API.employees.delete(id);
            await this.loadTable();
        }
    },

    escape(str) { return !str ? '' : str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;'); }
};