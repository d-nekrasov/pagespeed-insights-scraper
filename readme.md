# PageSpeed Insights Scraper

Этот скрипт анализирует производительность веб-страниц с помощью **Google PageSpeed Insights API** и сохраняет результаты в **CSV-файл**.  

## 📌 Функционал:
- Анализ мобильной (`mobile`) или десктопной (`desktop`) версии сайта
- Сбор метрик:
  - **Total Score** (общая оценка)
  - **Total Page Size (KB)** (размер страницы)
  - **FCP** (First Contentful Paint)
  - **LCP** (Largest Contentful Paint)
  - **CLS** (Cumulative Layout Shift)
  - **TBT** (Total Blocking Time)
  - **Speed Index**
- Передача параметров через командную строку:
  - `--strategy` — стратегия (`mobile` или `desktop`)
  - `--out` — путь к файлу CSV для сохранения результатов
  - `--source` — путь к файлу с URL-адресами  

---

## 🚀 Установка

1. **Склонируйте репозиторий или скачайте код**:
   ```sh
   git clone https://github.com/d-nekrasov/pagespeed-insights-scraper.git
   cd pagespeed-insights-scraper
   ```

2. **Установите зависимости**:
   ```sh
   npm install
   ```

3.	**Получите API-ключ Google PageSpeed Insights**:
	- Перейдите в Google Cloud Console
	-	Создайте новый проект
	-	Включите API PageSpeed Insights
	-	Получите API-ключ
	-	Укажите его в файле script.js:

    ```sh
    const API_KEY = 'YOUR_API_KEY'; // Укажите ваш API-ключ
    ```

## 📄 Использование


#### 1. Создайте файл со списком URL

Создайте файл `urls.txt` и добавьте ссылки (каждая с новой строки):
```
https://example.com
https://another-site.com
```

#### 2. Запустите анализ:

📱 Анализ мобильной версии:

```sh
node script.js --strategy mobile --out results_mobile.csv --source urls.txt
```
🖥 Анализ десктопной версии:
```sh
node script.js --strategy desktop --out results_desktop.csv --source urls.txt
```

#### 3. Получите результат в CSV

После выполнения скрипта появится файл results_mobile.csv или results_desktop.csv, содержащий:
| URL                 | Strategy | Total Score | Page Size (KB) | FCP (s) | LCP (s) | CLS  | TBT (ms) | Speed Index (s) |
|---------------------|---------|------------|----------------|---------|---------|------|----------|----------------|
| https://example.com | mobile  | 85         | 1200           | 1.2     | 2.5     | 0.01 | 150      | 3.5            |
| https://example.com | desktop | 90         | 1100           | 0.9     | 2.0     | 0.02 | 120      | 2.8            |


## 🔧 Возможные ошибки

- **“Error: API_KEY is invalid”** – проверьте, верно ли указан API-ключ.
- **“Rate limit exceeded”** – Google API имеет лимиты. Подключите платный тариф или используйте с паузами.
- **“N/A в результатах”** – сайт может быть недоступен или недоступен для анализа.