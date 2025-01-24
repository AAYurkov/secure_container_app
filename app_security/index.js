const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

const db = new sqlite3.Database("./trusted_apps.db", (err) => {
  if (err) {
    console.error("Ошибка подключения к базе данных:", err.message);
  } else {
    console.log("Подключение к базе данных SQLite успешно.");
  }
});

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("App Security Service is running!");
});

app.post("/check-app", (req, res) => {
  const { appName } = req.body;

  if (!appName) {
    return res.status(400).json({ error: "App name is required" });
  }

  const query = `
    SELECT is_trusted
    FROM trusted_apps
    WHERE app_name = ?
  `;

  db.get(query, [appName], (err, row) => {
    if (err) {
      console.error("Ошибка выполнения запроса:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (row) {
      const isTrusted = row.is_trusted === 1;
      res.json({ appName, isTrusted });
    } else {
      res.status(404).json({ error: "App not found in trusted list" });
    }
  });
});

app.listen(port, () => {
  console.log(`App Security Service is running on port ${port}`);
});
