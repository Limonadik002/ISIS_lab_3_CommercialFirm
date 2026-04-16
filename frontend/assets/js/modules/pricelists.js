const PricelistsModule = {
    async render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <h2>Прайс-лист</h2>
            <button class="btn btn-primary mb-3" id="addBtn">+ Добавить</button>
            <div id="tableContainer"><div class="spinner-border"></div></div>
            <div id="modalContainer"></div>
        `;
        await this.loadTable();
        document.getElementById('addBtn').onclick = () => this.showForm();
    },

    async loadTable() {
        const list = await API.pricelists.getAll();
        let html = `<table class="table table-bordered"><thead class="table-dark"><tr>
            <th>ID</th><th>Цена, у.е.</th><th>Действия</th>
        </tr></thead><tbody>`;
        for (const p of list) {
            html += `<tr>
                <td>${p.PriceList_ID}</td>
                <td>${Number(p.Price).toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-warning editBtn" data-id="${p.PriceList_ID}">✏️</button>
                    <button class="btn btn-sm btn-danger deleteBtn" data-id="${p.PriceList_ID}">🗑️</button>
                </td>
            </tr>`;
        }
        html += `</tbody><table>`;
        document.getElementById('tableContainer').innerHTML = html;
        document.querySelectorAll('.editBtn').forEach(btn => btn.onclick = () => this.showForm(btn.dataset.id));
        document.querySelectorAll('.deleteBtn').forEach(btn => btn.onclick = () => this.deleteItem(btn.dataset.id));
    },

    async showForm(id = null) {
        const isEdit = !!id;
        let data = {};
        if (isEdit) data = await API.pricelists.get(id);
        const modalHtml = `
            <div class="modal fade" id="pricelistModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5>${isEdit ? 'Редактировать' : 'Добавить'} цену</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="pricelistForm">
                                <div class="mb-2"><label>Цена *</label><input type="number" step="0.01" name="Price" class="form-control" value="${data.Price || ''}" required></div>
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
        const modal = new bootstrap.Modal(document.getElementById('pricelistModal'));
        modal.show();
        document.getElementById('saveBtn').onclick = async () => {
            const form = document.getElementById('pricelistForm');
            const formData = { Price: form.Price.value };
            if (isEdit) await API.pricelists.update(id, formData);
            else await API.pricelists.add(formData);
            modal.hide();
            await this.loadTable();
        };
    },

    async deleteItem(id) {
        if (confirm('Удалить позицию прайс-листа?')) {
            await API.pricelists.delete(id);
            await this.loadTable();
        }
    },

    escape(str) { return !str ? '' : str; }
};