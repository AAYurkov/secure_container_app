#!/bin/bash

# Массив с разрешенными и заблокированными приложениями
allowed_apps=("com.example.safeapp" "com.example.trustedapp" "com.example.verifiedapp" "com.example.officialapp" "com.example.legitapp")
blocked_apps=("com.example.maliciousapp" "com.example.untrustedapp" "com.example.fakeapp" "com.example.suspiciousapp" "com.example.harmfulapp")

# Генерация 20 случайных запросов
for i in {1..20}
do
  # Случайным образом выбираем разрешенное или заблокированное приложение
  if [ $((RANDOM % 2)) -eq 0 ]; then
    app="${allowed_apps[$((RANDOM % ${#allowed_apps[@]}))]}"
    message="Installation of ${app} is allowed."
  else
    app="${blocked_apps[$((RANDOM % ${#blocked_apps[@]}))]}"
    message="Installation of ${app} is blocked."
  fi

  # Выполняем запрос curl с случайными данными
  curl -X POST http://localhost:4000/install-app -H "Content-Type: application/json" -d "{\"appName\": \"$app\", \"app_version\": \"1.0\"}"

  # Печатаем, какой запрос был отправлен
  echo "Sent request: App: $app, Message: $message"
done
