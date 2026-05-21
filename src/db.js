const db = {
    // ЗАДАЧИ 
    getTasks() {
        const data = localStorage.getItem('dashboard_tasks');
        return data ? JSON.parse(data) : [];
    },
    saveTasks(tasks) {
        localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
    },
    addTask(task) {
        const tasks = this.getTasks();
        const newTask = {
            id: Date.now(),
            title: task.title,
            deadline: task.deadline || '',
            completed: false
        };
        tasks.push(newTask);
        this.saveTasks(tasks);
        return newTask;
    },
    toggleTask(taskId) {
        const tasks = this.getTasks();
        const task = tasks.find(t => t.id == taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks(tasks);
        }
        return tasks;
    },
    deleteTask(taskId) {
        const tasks = this.getTasks().filter(t => t.id != taskId);
        this.saveTasks(tasks);
        return tasks;
    },

    // ССЫЛКИ
    getLinks() {
        const data = localStorage.getItem('dashboard_links');
        return data ? JSON.parse(data) : [];
    },
    saveLinks(links) {
        localStorage.setItem('dashboard_links', JSON.stringify(links));
    },
    addLink(link) {
        const links = this.getLinks();
        const newLink = {
            id: Date.now(),
            title: link.title,
            url: link.url,
            category: link.category || 'Без категории',
            note: link.note || ''
        };
        links.push(newLink);
        this.saveLinks(links);
        if (link.category && link.category !== 'Без категории') {
            this.addCategory(link.category);
        }
        return newLink;
    },
    deleteLink(linkId) {
        const links = this.getLinks().filter(l => l.id != linkId);
        this.saveLinks(links);
        return links;
    },

    // КАТЕГОРИИ
    getCategories() {
        const data = localStorage.getItem('dashboard_categories');
        return data ? JSON.parse(data) : ['Лекции', 'Презентации', 'Методички', 'Другое'];
    },
    saveCategories(categories) {
        localStorage.setItem('dashboard_categories', JSON.stringify(categories));
    },
    addCategory(categoryName) {
        const categories = this.getCategories();
        if (!categoryName.trim()) return;
        const normalized = categoryName.trim();
        if (!categories.includes(normalized)) {
            categories.push(normalized);
            this.saveCategories(categories);
        }
        return categories;
    },
    deleteCategory(categoryName) {
        let categories = this.getCategories();
        categories = categories.filter(c => c !== categoryName);
        this.saveCategories(categories);
        let links = this.getLinks();
        let changed = false;
        links = links.map(link => {
            if (link.category === categoryName) {
                changed = true;
                return { ...link, category: 'Другое' };
            }
            return link;
        });
        if (changed) this.saveLinks(links);
        return categories;
    }
};