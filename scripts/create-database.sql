-- Criação das tabelas para o app de diabetes

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de medições de glicemia
CREATE TABLE IF NOT EXISTS glucose_readings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    value INTEGER NOT NULL,
    period VARCHAR(20) NOT NULL CHECK (period IN ('fasting', 'post_meal', 'bedtime')),
    notes TEXT,
    timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de alimentos (base de dados nutricional)
CREATE TABLE IF NOT EXISTS foods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    calories_per_100g DECIMAL(8,2) NOT NULL,
    carbs_per_100g DECIMAL(8,2) NOT NULL,
    protein_per_100g DECIMAL(8,2) NOT NULL,
    fat_per_100g DECIMAL(8,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de refeições/entradas nutricionais
CREATE TABLE IF NOT EXISTS meal_entries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    food_id INTEGER REFERENCES foods(id),
    food_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(8,2) NOT NULL, -- em gramas
    calories DECIMAL(8,2) NOT NULL,
    carbs DECIMAL(8,2) NOT NULL,
    protein DECIMAL(8,2) NOT NULL,
    fat DECIMAL(8,2) NOT NULL,
    meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de metas nutricionais do usuário
CREATE TABLE IF NOT EXISTS user_nutrition_goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    target_calories INTEGER DEFAULT 2000,
    target_carbs INTEGER DEFAULT 250,
    target_protein INTEGER DEFAULT 150,
    target_fat INTEGER DEFAULT 67,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_glucose_readings_user_timestamp ON glucose_readings(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_meal_entries_user_timestamp ON meal_entries(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_foods_name ON foods(name);
