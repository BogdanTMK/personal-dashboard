function getMondayLink() {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    
    const year = monday.getFullYear();
    const month = String(monday.getMonth() + 1).padStart(2, '0');
    const date = String(monday.getDate()).padStart(2, '0');
    
    return `https://schedule.mstimetables.ru/publications/cdb2a14c-a891-4f9f-b56c-7e8eb559c766#/groups/16/lessons?date=${year}-${month}-${date}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const link = document.getElementById('scheduleLink');
    if (link) link.href = getMondayLink();
});

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const isTasksPage = location.pathname.includes('index.html');
const isLinksPage = location.pathname.includes('links.html');

// СТРАНИЦА ЗАДАЧ
if (isTasksPage) {
    function renderTasks() {
        const tasks = db.getTasks();
        const container = document.getElementById('tasksContainer');
        if (!container) return;
        if (tasks.length === 0) {
            container.innerHTML = '<li class="empty-message">Нет задач</li>';
            return;
        }
        container.innerHTML = tasks.map(task => `
            <li class="task-item" data-id="${task.id}">
                <div class="task-info">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                    <span class="task-title ${task.completed ? 'completed' : ''}">${escapeHtml(task.title)}</span>
                    ${task.deadline ? `<span class="task-deadline">${task.deadline}</span>` : ''}
                </div>
                <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Удалить</button>
            </li>
        `).join('');
        
        document.querySelectorAll('.task-checkbox').forEach(cb => {
            cb.addEventListener('change', e => {
                db.toggleTask(e.target.dataset.id);
                renderTasks();
            });
        });
        document.querySelectorAll('.delete-task').forEach(btn => {
            btn.addEventListener('click', e => {
                db.deleteTask(e.target.dataset.id);
                renderTasks();
            });
        });
    }
    
    document.getElementById('addTaskBtn')?.addEventListener('click', () => {
        const title = document.getElementById('taskTitle').value.trim();
        const deadline = document.getElementById('taskDeadline').value;
        if (!title) return alert('Введите название задачи');
        db.addTask({ title, deadline });
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDeadline').value = '';
        renderTasks();
    });
    renderTasks();
}

// СТРАНИЦА ССЫЛОК
if (isLinksPage) {
    let currentFilter = 'all';
    
    function updateCategoryDropdowns() {
        const categories = db.getCategories();
        const select = document.getElementById('linkCategorySelect');
        if (select) {
            select.innerHTML = '<option value="">-- Выбрать категорию --</option>' + 
                categories.map(cat => `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`).join('');
        }
        const filterSelect = document.getElementById('filterCategory');
        if (filterSelect) {
            filterSelect.innerHTML = '<option value="all">Все категории</option>' + 
                categories.map(cat => `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`).join('');
            filterSelect.value = currentFilter;
        }
    }
    
    function addNewCategory() {
        const newCatInput = document.getElementById('linkCategoryNew');
        const newCat = newCatInput.value.trim();
        if (!newCat) return alert('Введите название категории');
        db.addCategory(newCat);
        newCatInput.value = '';
        updateCategoryDropdowns();
        alert('Категория добавлена: ' + newCat);
    }
    
    function renderLinks() {
        let links = db.getLinks();
        if (currentFilter !== 'all') {
            links = links.filter(l => l.category === currentFilter);
        }
        const container = document.getElementById('linksContainer');
        if (!container) return;
        if (links.length === 0) {
            container.innerHTML = '<p class="empty-message">Нет ссылок</p>';
            return;
        }
        container.innerHTML = links.map(link => `
            <div class="link-card" data-id="${link.id}">
                <div class="link-info">
                    <div class="link-title"><a href="${escapeHtml(link.url)}" target="_blank">${escapeHtml(link.title)}</a></div>
                    <span class="link-category">${escapeHtml(link.category)}</span>
                    <button class="btn btn-danger btn-sm delete-link" data-id="${link.id}">Удалить</button>
                </div>
                ${link.note ? `<div class="link-note">${escapeHtml(link.note)}</div>` : ''}
            </div>
        `).join('');
        
        document.querySelectorAll('.delete-link').forEach(btn => {
            btn.addEventListener('click', e => {
                db.deleteLink(e.target.dataset.id);
                renderLinks();
            });
        });
    }
    
    function addLink() {
        const title = document.getElementById('linkTitle').value.trim();
        let url = document.getElementById('linkUrl').value.trim();
        let category = document.getElementById('linkCategorySelect').value;
        const newCategory = document.getElementById('linkCategoryNew').value.trim();
        const note = document.getElementById('linkNote').value.trim();
        
        if (!title) return alert('Введите название');
        if (!url) return alert('Введите URL');
        if (!url.startsWith('http')) url = 'https://' + url;
        
        if (newCategory) {
            category = newCategory;
            db.addCategory(newCategory);
            document.getElementById('linkCategoryNew').value = '';
            updateCategoryDropdowns();
        }
        if (!category) category = 'Без категории';
        
        db.addLink({ title, url, category, note });
        document.getElementById('linkTitle').value = '';
        document.getElementById('linkUrl').value = '';
        document.getElementById('linkNote').value = '';
        renderLinks();
    }
    
    document.getElementById('addCategoryBtn')?.addEventListener('click', addNewCategory);
    document.getElementById('addLinkBtn')?.addEventListener('click', addLink);
    document.getElementById('filterCategory')?.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        renderLinks();
    });
    
    updateCategoryDropdowns();
    renderLinks();
}