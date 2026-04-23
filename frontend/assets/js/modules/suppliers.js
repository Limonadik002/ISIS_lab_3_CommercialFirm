const SuppliersModule = {
    async render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <h2>Поставщики</h2>
            <button class="btn btn-primary mb-3" id="addBtn">+ Добавить</button>
            <div id="tableContainer"><div class="spinner-border"></div></div>
            <div id="modalContainer"></div>
        `;
        await this.loadTable();
        document.getElementById('addBtn').onclick = () => this.showForm();
    },

    async loadTable() {
        const list = await API.suppliers.getAll();
        let html = `<table class="table table-bordered"><thead class="table-dark">
            <th>Название</th><th>Адрес</th><th>Действия</th>
        <tr></thead><tbody>`;
        for (const s of list) {
            html += `<tr>
                <td>${this.escape(s.Name)}</td>
                <td>${this.escape(s.Address)}</td>
                <td>
                    <button class="btn btn-sm btn-warning editBtn" data-id="${s.Supplier_ID}">✏️</button>
                    <button class="btn btn-sm btn-danger deleteBtn" data-id="${s.Supplier_ID}">🗑️</button>
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
        if (isEdit) data = await API.suppliers.get(id);
        const modalHtml = `
            <div class="modal fade" id="suppModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5>${isEdit ? 'Редактировать' : 'Добавить'} поставщика</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div id="formError" class="alert alert-danger" style="display:none;"></div>
                            <form id="suppForm">
                                <div class="mb-2"><label>Название *</label><input name="Name" class="form-control" value="${this.escape(data.Name)}" required></div>
                                <div class="mb-2"><label>Адрес *</label><input name="Address" class="form-control" value="${this.escape(data.Address)}" required></div>
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
        const modal = new bootstrap.Modal(document.getElementById('suppModal'));
        modal.show();

        const errorDiv = document.getElementById('formError');
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.onclick = async () => {
            errorDiv.style.display = 'none';
            const form = document.getElementById('suppForm');
            const formData = {
                Name: form.Name.value,
                Address: form.Address.value
            };
            try {
                if (isEdit) await API.suppliers.update(id, formData);
                else await API.suppliers.add(formData);
                modal.hide();
                await this.loadTable();
            } catch (err) {
                errorDiv.style.display = 'block';
                errorDiv.innerText = err.message;
            }
        };
    },

    async deleteItem(id) {
        if (confirm('Удалить поставщика?')) {
            await API.suppliers.delete(id);
            await this.loadTable();
        }
    },

    escape(str) { return !str ? '' : str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;'); }
};