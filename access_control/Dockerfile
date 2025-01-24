FROM node:20-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json в контейнер
COPY package.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы
COPY . .

# Открываем порт
EXPOSE 4000

# Запускаем приложение
CMD ["node", "index.js"]
