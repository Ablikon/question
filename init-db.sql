CREATE TABLE IF NOT EXISTS survey_responses (
  id SERIAL PRIMARY KEY,
  answers JSONB NOT NULL,
  submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  device VARCHAR(50),
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_submitted_at ON survey_responses(submitted_at DESC);

-- Добавить колонки если таблица уже существует
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS device VARCHAR(50);
ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS user_agent TEXT;
