-- получить все невыполненные задачи
SELECT * FROM tasks WHERE completed = FALSE ORDER BY deadline NULLS LAST;

-- добавить новую задачу
INSERT INTO tasks (title, deadline, completed) 
VALUES ('Новая задача', '2026-06-01', FALSE);

-- отметить задачу как выполненную
UPDATE tasks SET completed = TRUE WHERE id = 1;

-- удалить задачу
DELETE FROM tasks WHERE id = 2;

-- получить все ссылки с названиями категорий
SELECT l.id, l.title, l.url, c.name AS category, l.note, l.created_at
FROM links l
LEFT JOIN categories c ON l.category_id = c.id
ORDER BY l.created_at DESC;