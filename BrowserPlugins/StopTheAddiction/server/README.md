Stop The Addiction — Local Report Receiver

This small Node.js server accepts POST /report and writes the received JSON
to a local file for forensic/archive purposes.

Usage

1. Install dependencies:

```bash
cd BrowserPlugins/StopTheAddiction/server
npm install
```

2. Run the server:

```bash
npm start
# or
REPORT_PATH="E:\\Shyam AI\\ShyamAI\\BrowserPlugins\\StopTheAddiction\\abc.json" PORT=5000 npm start
```

3. In the extension popup set the "Reporting endpoint" to:

```
http://localhost:5000/report
```

The server will write incoming JSON into the configured directory (default shown above)
and use timestamped filenames like `StopTheAddiction-abc-2026-07-25T12-34-56-789Z.json`.

Security note: this server accepts unauthenticated POSTs on the local machine. Run only on trusted networks or add authentication if exposed.
