const SupplierOffersModule = {
    async render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <h2>Предложения поставщиков</h2>
            <button class="btn btn-primary mb-3" id="addBtn">+ Добавить</button>
            <div id="tableContainer"><div class="spinner-border"></div></div>
            <div id="modalContainer"></div>
        `;
        await this.loadTable();
        document.getElementById('addBtn').onclick = () => this.showForm();
    },

    async loadTable() {
        const list = await API.supplieroffers.getAll();
        let html = `<table class="table table-bordered"><thead class="table-dark">
            <th>Модель</th><th>Поставщик</th><th>Действия</th>
        </tr></thead><tbody>`;
        for (const item of list) {
            html += `<tr>
                <td>${this.escape(item.Model_name)}</td>
                <td>${this.escape(item.SupplierName)}</td>
                <td>
                    <button class="btn btn-sm btn-warning editBtn" data-id="${item.Offer_ID}">✏️</button>
                    <button class="btn btn-sm btn-danger deleteBtn" data-id="${item.Offer_ID}">🗑️</button>
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
        let models = [], suppliers = [];

        if (isEdit) data = await API.supplieroffers.get(id);
        models = await API.supplieroffers.getModelOptions();
        suppliers = await API.supplieroffers.getSupplierOptions();

        const modelSelect = models.map(m => 
            `<option value="${m.Model_ID}" ${data.Model_ID == m.Model_ID ? 'selected' : ''}>
                ${this.escape(m.Model_name)}
            </option>`
        ).join('');

        const supplierSelect = suppliers.map(s => 
            `<option value="${s.Supplier_ID}" ${data.Supplier_ID == s.Supplier_ID ? 'selected' : ''}>
                ${this.escape(s.Description)}
            </option>`
        ).join('');

        const modalHtml = `
            <div class="modal fade" id="offerModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5>${isEdit ? 'Редактировать' : 'Добавить'} предложение</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div id="formError" class="alert alert-danger" style="display:none;"></div>
                            <form id="offerForm">
                                <div class="mb-2">
                                    <label>Модель *</label>
                                    <select name="Model_ID" class="form-select" required>${modelSelect}</select>
                                </div>
                                <div class="mb-2">
                                    <label>Поставщик *</label>
                                    <select name="Supplier_ID" class="form-select" required>${supplierSelect}</select>
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
        const modal = new bootstrap.Modal(document.getElementById('offerModal'));
        modal.show();

        const errorDiv = document.getElementById('formError');
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.onclick = async () => {
            errorDiv.style.display = 'none';
            const form = document.getElementById('offerForm');
            const formData = {
                Model_ID: form.Model_ID.value,
                Supplier_ID: form.Supplier_ID.value
            };
            try {
                if (isEdit) await API.supplieroffers.update(id, formData);
                else await API.supplieroffers.add(formData);
                modal.hide();
                await this.loadTable();
            } catch (err) {
                errorDiv.style.display = 'block';
                errorDiv.innerText = err.message;
            }
        };
    },

    async deleteItem(id) {
        if (confirm('Удалить предложение поставщика?')) {
            await API.supplieroffers.delete(id);
            await this.loadTable();
        }
    },

    escape(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
    }
};