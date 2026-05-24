INSERT INTO categories (name) VALUES
    ('Лекции'),
    ('Презентации'),
    ('Методички'),
    ('Другое');

INSERT INTO tasks (title, deadline, completed) VALUES
    ('Сдать отчёт по практике', '2026-07-01', FALSE),
    ('Подготовить презентацию', '2026-06-10', FALSE),
    ('Прочитать книгу', '2026-05-25', TRUE);

-- Добавляем примеры ссылок
INSERT INTO links (title, url, category_id, note) VALUES
    ('Запись лекции', 'https://example.com/lecture', 1, NULL),
    ('Методичка по химии', 'https://example.com/thhh', 3, NULL),
    ('Презентация по физике', 'https://example.com/slides', 2, NULL);