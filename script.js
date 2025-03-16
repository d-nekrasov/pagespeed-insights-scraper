const fs = require('fs');
const axios = require('axios');
const { createObjectCsvWriter } = require('csv-writer');
const yargs = require('yargs');

const argv = yargs
    .option('strategy', {
        alias: 's',
        describe: 'Стратегия анализа: mobile или desktop',
        type: 'string',
        choices: ['mobile', 'desktop'],
        demandOption: true
    })
    .option('out', {
        alias: 'o',
        describe: 'Путь и имя файла CSV для сохранения результата',
        type: 'string',
        demandOption: true
    })
    .option('source', {
        alias: 'i',
        describe: 'Путь и имя файла с URL для сканирования',
        type: 'string',
        demandOption: true
    })
    .help()
    .alias('help', 'h')
    .argv;

const API_KEY = 'YOUR_API_KEY'; // set your API key
const STRATEGY = argv.strategy;
const INPUT_FILE = argv.source;
const OUTPUT_FILE = argv.out;

const csvWriter = createObjectCsvWriter({
    path: OUTPUT_FILE,
    header: [
        { id: 'url', title: 'URL' },
        { id: 'strategy', title: 'Strategy' },
        { id: 'score', title: 'Total Score' },
        { id: 'pageSize', title: 'Total Page Size (KB)' },
        { id: 'fcp', title: 'FCP (s)' },
        { id: 'lcp', title: 'LCP (s)' },
        { id: 'cls', title: 'CLS' },
        { id: 'tbt', title: 'Total Blocking Time (ms)' },
        { id: 'speedIndex', title: 'Speed Index (s)' }
    ]
});

async function analyzePageSpeed(url, strategy) {
    try {
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${API_KEY}&strategy=${strategy}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        const score = data.lighthouseResult.categories.performance.score * 100;
        const fcp = data.lighthouseResult.audits['first-contentful-paint'].numericValue / 1000;
        const lcp = data.lighthouseResult.audits['largest-contentful-paint'].numericValue / 1000;
        const cls = data.lighthouseResult.audits['cumulative-layout-shift'].numericValue;
        const tbt = data.lighthouseResult.audits['total-blocking-time'].numericValue;
        const speedIndex = data.lighthouseResult.audits['speed-index'].numericValue / 1000;

        const pageSize = Object.values(data.lighthouseResult.audits)
            .filter(audit => audit.details && audit.details.items)
            .reduce((total, audit) => total + (audit.details.items[0]?.totalBytes || 0), 0) / 1024;

        return {
            url,
            strategy,
            score,
            pageSize: pageSize.toFixed(2),
            fcp: fcp.toFixed(2),
            lcp: lcp.toFixed(2),
            cls,
            tbt,
            speedIndex: speedIndex.toFixed(2)
        };
    } catch (error) {
        console.error(`Ошибка анализа ${url} (${strategy}):`, error.message);
        return {
            url,
            strategy,
            score: 'N/A',
            pageSize: 'N/A',
            fcp: 'N/A',
            lcp: 'N/A',
            cls: 'N/A',
            tbt: 'N/A',
            speedIndex: 'N/A'
        };
    }
}

async function processUrls() {
    const urls = fs.readFileSync(INPUT_FILE, 'utf-8').split(/\r?\n/).filter(Boolean);
    const results = [];

    for (const url of urls) {
        console.log(`Анализ: ${url} (${STRATEGY})`);
        results.push(await analyzePageSpeed(url, STRATEGY));
    }

    await csvWriter.writeRecords(results);
    console.log(`✅ Success! Data saved in ${OUTPUT_FILE}`);
}

processUrls();