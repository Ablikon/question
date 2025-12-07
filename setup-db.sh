#!/bin/bash
# filepath: /Users/abylajhanbegimkulov/Desktop/opros/altyn-question/setup-db.sh

echo "🗄️  Настройка базы данных PostgreSQL..."

# Создание базы данных
createdb altyn_survey 2>/dev/null || echo "База данных уже существует"

# Выполнение SQL скрипта
psql -d altyn_survey -f init-db.sql

echo "✅ База данных настроена!"
echo "📝 Connection string: postgresql://postgres:postgres@localhost:5432/altyn_survey"