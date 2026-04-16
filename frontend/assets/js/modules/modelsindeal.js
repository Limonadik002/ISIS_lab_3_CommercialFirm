const ModelsInDealModule = {
    async render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <h2>Позиции в сделках</h2>
            <button class="btn btn-primary mb-3" id="addBtn">+ Добавить</button>
            <div id="tableContainer"><div class="spinner-border"></div></div>
            <div id="modalContainer"></div>
        `;
        await this.loadTable();
        document.getElementById('addBtn').onclick = () => this.showForm();
    },

    async loadTable() {
        const list = await API.modelsindeal.getAll();
        let html = `<table class="table table-bordered"><thead class="table-dark"><tr>
            <th>ID</th><th>Модель</th><th>Сделка (ID - Клиент)</th><th>Количество</th><th>Действия</th>
        </tr></thead><tbody>`;
        for (const item of list) {
            html += `<tr>
                <td>${item.Position_ID}</td>
                <td>${this.escape(item.Model_name)}</td>
                <td>${this.escape(item.ClientName)} (Deal #${item.Deal_ID})</td>
                <td>${item.Quantity}</td>
                <td>
                    <button class="btn btn-sm btn-warning editBtn" data-id="${item.Position_ID}">✏️</button>
                    <button class="btn btn-sm btn-danger deleteBtn" data-id="${item.Position_ID}">🗑️</button>
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
        let models = [], deals = [];
        if (isEdit) data = await API.modelsindeal.get(id);
        models = await API.modelsindeal.getModelOptions();
        deals = await API.modelsindeal.getDealOptions();
        const modelSelect = models.map(m => `<option value="${m.Model_ID}" ${data.Model_ID == m.Model_ID ? 'selected' : ''}>${this.escape(m.Model_name)}</option>`).join('');
        const dealSelect = deals.map(d => `<option value="${d.Deal_ID}" ${data.Deal_ID == d.Deal_ID ? 'selected' : ''}>${this.escape(d.Description)}</option>`).join('');
        const modalHtml = `
            <div class="modal fade" id="positionModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5>${isEdit ? 'Редактировать' : 'Добавить'} позицию</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="positionForm">
                                <div class="mb-2"><label>Модель *</label><select name="Model_ID" class="form-select">${modelSelect}</select></div>
                                <div class="mb-2"><label>Сделка *</label><select name="Deal_ID" class="form-select">${dealSelect}</select></div>
                                <div class="mb-2"><label>Количество</label><input type="number" name="Quantity" class="form-control" value="${data.Quantity || 1}" min="1"></div>
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
        const modal = new bootstrap.Modal(document.getElementById('positionModal'));
        modal.show();
        document.getElementById('saveBtn').onclick = async () => {
            const form = document.getElementById('positionForm');
            const formData = {
                Model_ID: form.Model_ID.value,
                Deal_ID: form.Deal_ID.value,
                Quantity: form.Quantity.value
            };
            if (isEdit) await API.modelsindeal.update(id, formData);
            else await API.modelsindeal.add(formData);
            modal.hide();
            await this.loadTable();
        };
    },

    async deleteItem(id) {
        if (confirm('Удалить позицию из сделки?')) {
            await API.modelsindeal.delete(id);
            await this.loadTable();
        }
    },

    escape(str) { return !str ? '' : str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;'); }
};