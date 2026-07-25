const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));

// Default output directory and filename prefix. Override with REPORT_PATH env var.
const DEFAULT_OUTPUT_DIR = 'E:\\Shyam AI\\ShyamAI\\BrowserPlugins\\StopTheAddiction\\';
const OUTPUT_DIR = process.env.REPORT_PATH || DEFAULT_OUTPUT_DIR;
const FILENAME_PREFIX = process.env.REPORT_PREFIX || 'StopTheAddiction-abc-';

app.post('/report', (req, res) => {
  try {
    const data = req.body || {};
    const json = JSON.stringify(data, null, 2);
    const dir = OUTPUT_DIR;
    fs.mkdirSync(dir, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const outFile = path.join(dir, `${FILENAME_PREFIX}${ts}.json`);
    fs.writeFileSync(outFile, json, 'utf8');
    console.log('Wrote report to', outFile);
    res.json({ ok: true, path: outFile });
  } catch (err) {
    console.error('Failed to write report:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`StopTheAddiction report server listening on http://localhost:${port}`);
  console.log(`Writing reports to: ${OUTPUT_PATH}`);
});
