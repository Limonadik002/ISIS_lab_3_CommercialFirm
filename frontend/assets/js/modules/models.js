const CarModelsModule = {
    async render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <h2>Модели автомобилей</h2>
            <button class="btn btn-primary mb-3" id="addBtn">+ Добавить</button>
            <div id="tableContainer"><div class="spinner-border"></div></div>
            <div id="modalContainer"></div>
        `;
        await this.loadTable();
        document.getElementById('addBtn').onclick = () => this.showForm();
    },

    async loadTable() {
        const list = await API.models.getAll();
        let html = `<table class="table table-bordered"><thead class="table-dark">
            <th>Модель</th><th>Цвет</th><th>Цена</th><th>КПП</th><th>Топливо</th><th>Действия</th>
        </tr></thead><tbody>`;
        for (const m of list) {
            html += `<tr>
                <td>${this.escape(m.Model_name)}</td>
                <td>${this.escape(m.Color)}</td>
                <td>${Number(m.Price).toFixed(2)}</td>
                <td>${this.escape(m.Transmission)}</td>
                <td>${this.escape(m.FuelType)}</td>
                <td>
                    <button class="btn btn-sm btn-warning editBtn" data-id="${m.Model_ID}">✏️</button>
                    <button class="btn btn-sm btn-danger deleteBtn" data-id="${m.Model_ID}">🗑️</button>
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

        if (isEdit) {
            data = await API.models.get(id);
        }
        
        const transmissionOptions = [
            'Механическая',
            'Автоматическая',
            'Роботизированная',
            'Вариатор'
        ];
        const fuelTypeOptions = [
            'Бензин',
            'Дизель',
            'Электро',
            'Гибрид',
            'Газ'
        ];

        const transmissionSelect = transmissionOptions.map(opt => 
            `<option value="${opt}" ${data.Transmission === opt ? 'selected' : ''}>${opt}</option>`
        ).join('');
        const fuelSelect = fuelTypeOptions.map(opt => 
            `<option value="${opt}" ${data.FuelType === opt ? 'selected' : ''}>${opt}</option>`
        ).join('');

        const modalHtml = `
            <div class="modal fade" id="modelModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5>${isEdit ? 'Редактировать' : 'Добавить'} модель</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div id="formError" class="alert alert-danger" style="display:none;"></div>
                            <form id="modelForm">
                                <div class="mb-2">
                                    <label>Модель *</label>
                                    <input name="Model_name" class="form-control" value="${this.escape(data.Model_name)}" required>
                                </div>
                                <div class="mb-2">
                                    <label>Цвет *</label>
                                    <input name="Color" class="form-control" value="${this.escape(data.Color)}" required>
                                </div>
                                <div class="mb-2">
                                    <label>Цена, у.е. *</label>
                                    <input type="number" step="0.01" name="Price" class="form-control" value="${data.Price || ''}" required>
                                </div>
                                <div class="mb-2">
                                    <label>Мощность (л.с.)</label>
                                    <input type="number" name="Horsepower" class="form-control" value="${data.Horsepower || ''}">
                                </div>
                                <div class="mb-2">
                                    <label>Вес (кг)</label>
                                    <input type="number" name="Weight" class="form-control" value="${data.Weight || ''}">
                                </div>
                                <div class="mb-2">
                                    <label>КПП *</label>
                                    <select name="Transmission" class="form-select" required>${transmissionSelect}</select>
                                </div>
                                <div class="mb-2">
                                    <label>Топливо *</label>
                                    <select name="FuelType" class="form-select" required>${fuelSelect}</select>
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
        const modal = new bootstrap.Modal(document.getElementById('modelModal'));
        modal.show();

        const errorDiv = document.getElementById('formError');
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.onclick = async () => {
            errorDiv.style.display = 'none';
            const form = document.getElementById('modelForm');
            const formData = {
                Model_name: form.Model_name.value,
                Color: form.Color.value,
                Price: parseFloat(form.Price.value),
                Horsepower: form.Horsepower.value ? parseInt(form.Horsepower.value) : null,
                Weight: form.Weight.value ? parseInt(form.Weight.value) : null,
                Transmission: form.Transmission.value,
                FuelType: form.FuelType.value
            };
            try {
                if (isEdit) {
                    await API.models.update(id, formData);
                } else {
                    await API.models.add(formData);
                }
                modal.hide();
                await this.loadTable();
            } catch (err) {
                errorDiv.style.display = 'block';
                errorDiv.innerText = err.message;
            }
        };
    },

    async deleteItem(id) {
        if (confirm('Удалить модель?')) {
            await API.models.delete(id);
            await this.loadTable();
        }
    },

    escape(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
    }
};