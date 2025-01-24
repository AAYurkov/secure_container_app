const express = require('express');
const axios = require('axios');
const promClient = require('prom-client');
const app = express();

app.use(express.json());

// Создаём счетчики метрик
const allowedCounter = new promClient.Counter({
  name: 'access_control_install_allowed_total',
  help: 'Total number of allowed app installs',
});

const blockedCounter = new promClient.Counter({
  name: 'access_control_install_blocked_total',
  help: 'Total number of blocked app installs',
});

// Экспортируем метрики для Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Обрабатываем запрос на установку приложения
app.post("/install-app", async (req, res) => {
  const { appName, app_version } = req.body;  // Распаковываем appName и app_version

  if (!appName || !app_version) {
    console.error("App name and version are required");
    return res.status(400).json({ error: "App name and version are required" });
  }

  try {
    // Отправляем запрос в app_security для проверки приложения
    console.log(`Checking app ${appName} with version ${app_version} in app_security service...`);
    const response = await axios.post("http://app_security:5000/check-app", { appName, app_version });

    // Проверяем ответ от app_security
    if (response.data.isTrusted) {
      console.log(`Installation of ${appName} is allowed.`);
      allowedCounter.inc();  // Увеличиваем счетчик успешных установок
      return res.status(200).json({ message: `Installation of ${appName} is allowed.` });
    } else {
      console.log(`Installation of ${appName} is blocked.`);
      blockedCounter.inc();  // Увеличиваем счетчик заблокированных установок
      return res.status(403).json({ message: `Installation of ${appName} is blocked.` });
    }
  } catch (error) {
    console.error("Error communicating with app_security:", error.message);
    return res.status(500).json({ error: "Failed to verify the application. Please try again later." });
  }
});

// Запуск сервера
app.listen(4000, () => {
  console.log("Access control service running on port 4000");
});
