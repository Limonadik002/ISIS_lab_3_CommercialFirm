const DealsModule = {
    async render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <h2>Сделки</h2>
            <button class="btn btn-primary mb-3" id="addBtn">+ Добавить</button>
            <div id="tableContainer"><div class="spinner-border"></div></div>
            <div id="modalContainer"></div>
        `;
        await this.loadTable();
        document.getElementById('addBtn').onclick = () => this.showForm();
    },

    async loadTable() {
        const list = await API.deals.getAll();
        let html = `<table class="table table-bordered"><thead class="table-dark">
            <th>Клиент</th><th>Сотрудник</th><th>Статус</th><th>Дата</th><th>Действия</th>
        <tr></thead><tbody>`;
        for (const d of list) {
            html += `<tr>
                <td>${this.escape(d.ClientName)}</td>
                <td>${this.escape(d.EmployeeName)}</td>
                <td>${d.OrderStatus == 1 ? 'Завершена' : 'Ожидает'}</td>
                <td>${d.OrderDate}</td>
                <td>
                    <button class="btn btn-sm btn-warning editBtn" data-id="${d.Deal_ID}">✏️</button>
                    <button class="btn btn-sm btn-danger deleteBtn" data-id="${d.Deal_ID}">🗑️</button>
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
        let clients = [], employees = [];

        if (isEdit) data = await API.deals.get(id);
        clients = await API.deals.getClientOptions();   // массив {Client_ID, Description}
        employees = await API.deals.getEmployeeOptions(); // массив {Employee_ID, Description}

        const clientSelect = clients.map(c => 
            `<option value="${c.Client_ID}" ${data.Client_ID == c.Client_ID ? 'selected' : ''}>
                ${this.escape(c.Description)}
            </option>`
        ).join('');

        const employeeSelect = employees.map(e => 
            `<option value="${e.Employee_ID}" ${data.Employee_ID == e.Employee_ID ? 'selected' : ''}>
                ${this.escape(e.Description)}
            </option>`
        ).join('');

        const modalHtml = `
            <div class="modal fade" id="dealModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5>${isEdit ? 'Редактировать' : 'Добавить'} сделку</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div id="formError" class="alert alert-danger" style="display:none;"></div>
                            <form id="dealForm">
                                <div class="mb-2">
                                    <label>Клиент *</label>
                                    <select name="Client_ID" class="form-select" required>${clientSelect}</select>
                                </div>
                                <div class="mb-2">
                                    <label>Сотрудник *</label>
                                    <select name="Employee_ID" class="form-select" required>${employeeSelect}</select>
                                </div>
                                <div class="mb-2">
                                    <label>Статус</label>
                                    <select name="OrderStatus" class="form-select">
                                        <option value="1" ${data.OrderStatus == 1 ? 'selected' : ''}>Завершена</option>
                                        <option value="0" ${data.OrderStatus == 0 ? 'selected' : ''}>Ожидает</option>
                                    </select>
                                </div>
                                <div class="mb-2">
                                    <label>Дата *</label>
                                    <input type="date" name="OrderDate" class="form-control" 
                                           value="${data.OrderDate || new Date().toISOString().slice(0,10)}" required>
                                </div>
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
        const modal = new bootstrap.Modal(document.getElementById('dealModal'));
        modal.show();

        const errorDiv = document.getElementById('formError');
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.onclick = async () => {
            errorDiv.style.display = 'none';
            const form = document.getElementById('dealForm');
            const formData = {
                Client_ID: form.Client_ID.value,
                Employee_ID: form.Employee_ID.value,
                OrderStatus: form.OrderStatus.value,
                OrderDate: form.OrderDate.value
            };
            try {
                if (isEdit) await API.deals.update(id, formData);
                else await API.deals.add(formData);
                modal.hide();
                await this.loadTable();
            } catch (err) {
                errorDiv.style.display = 'block';
                errorDiv.innerText = err.message;
            }
        };
    },

    async deleteItem(id) {
        if (confirm('Удалить сделку?')) {
            await API.deals.delete(id);
            await this.loadTable();
        }
    },

    escape(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
    }
};