-- Inserção de dados iniciais

-- Usuário de exemplo
INSERT INTO users (name, email) VALUES 
('João Silva', 'joao@example.com')
ON CONFLICT (email) DO NOTHING;

-- Alimentos base
INSERT INTO foods (name, calories_per_100g, carbs_per_100g, protein_per_100g, fat_per_100g) VALUES
('Arroz branco cozido', 130, 28, 2.7, 0.3),
('Peito de frango grelhado', 165, 0, 31, 3.6),
('Feijão carioca cozido', 76, 14, 4.8, 0.5),
('Batata doce cozida', 86, 20, 1.6, 0.1),
('Banana', 89, 23, 1.1, 0.3),
('Maçã', 52, 14, 0.3, 0.2),
('Ovos cozidos', 155, 1.1, 13, 11),
('Aveia', 389, 66, 17, 7),
('Leite desnatado', 34, 5, 3.4, 0.1),
('Pão integral', 247, 41, 13, 4.2),
('Brócolis cozido', 35, 7, 3, 0.4),
('Salmão grelhado', 206, 0, 22, 12),
('Batata inglesa cozida', 87, 20, 2, 0.1),
('Iogurte natural', 61, 4.7, 3.5, 3.3),
('Castanha do Pará', 656, 12, 14, 67),
('Tomate', 18, 3.9, 0.9, 0.2),
('Alface', 15, 2.9, 1.4, 0.2),
('Cenoura crua', 41, 10, 0.9, 0.2),
('Azeite de oliva', 884, 0, 0, 100),
('Quinoa cozida', 120, 22, 4.4, 1.9)
ON CONFLICT DO NOTHING;

-- Medições de glicemia de exemplo
INSERT INTO glucose_readings (user_id, value, period, notes, timestamp) VALUES
(1, 95, 'fasting', 'Medição matinal', NOW() - INTERVAL '2 hours'),
(1, 140, 'post_meal', 'Após almoço', NOW() - INTERVAL '4 hours'),
(1, 110, 'bedtime', 'Antes de dormir', NOW() - INTERVAL '1 day'),
(1, 88, 'fasting', 'Jejum', NOW() - INTERVAL '1 day 2 hours'),
(1, 135, 'post_meal', 'Pós jantar', NOW() - INTERVAL '1 day 6 hours')
ON CONFLICT DO NOTHING;

-- Metas nutricionais padrão
INSERT INTO user_nutrition_goals (user_id, target_calories, target_carbs, target_protein, target_fat) VALUES
(1, 2000, 250, 150, 67)
ON CONFLICT DO NOTHING;

-- Refeições de exemplo
INSERT INTO meal_entries (user_id, food_id, food_name, quantity, calories, carbs, protein, fat, meal_type, timestamp) VALUES
(1, 8, 'Aveia', 50, 195, 33, 8.5, 3.5, 'breakfast', NOW() - INTERVAL '6 hours'),
(1, 5, 'Banana', 120, 107, 27.6, 1.3, 0.4, 'breakfast', NOW() - INTERVAL '6 hours'),
(1, 2, 'Peito de frango grelhado', 150, 248, 0, 46.5, 5.4, 'lunch', NOW() - INTERVAL '3 hours'),
(1, 1, 'Arroz branco cozido', 100, 130, 28, 2.7, 0.3, 'lunch', NOW() - INTERVAL '3 hours'),
(1, 3, 'Feijão carioca cozido', 80, 61, 11.2, 3.8, 0.4, 'lunch', NOW() - INTERVAL '3 hours')
ON CONFLICT DO NOTHING;
