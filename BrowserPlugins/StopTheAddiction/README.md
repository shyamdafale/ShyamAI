# Stop The Addiction Browser Extension

This extension detects explicit or harmful websites and notifies the user. It also provides a simple email reporting flow.

## Files
- `manifest.json` — extension metadata and permissions
- `background.js` — URL detection, notifications, and email report launcher
- `content_script.js` — page content scanning and explicit-word detection
- `popup.html` / `popup.js` / `styles.css` — extension popup UI
- `icons/icon48.png` / `icons/icon128.png` — extension icons

## Install in Chrome / Edge / Brave
1. Open `chrome://extensions` or `edge://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select the folder: `BrowserPlugins/StopTheAddiction`.
5. The extension should install and show the icon in the browser toolbar.

## Usage
- The extension runs on all pages and checks URLs and page text for explicit keywords.
- If suspicious content is detected, it creates a notification.
- Click the notification button to report via email.
- Use the popup to set the reporting email address.

## Notes
- The extension uses `mailto:` for email reporting because browser extensions cannot directly send email without a backend.
- For automatic email sending, add a server endpoint and update `background.js` to POST report data.

## Testing
- Visit a sample page containing explicit words like `porn`, `adult`, or `xxx`.
- Visit `https://www.instagram.com/` and search for explicit hashtags or text.
- Check notifications and open the popup to update the report email.
