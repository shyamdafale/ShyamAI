# Stop The Addiction — Testing Guide

Use this guide to verify the browser extension is functioning correctly after installation.

## 1. Install the extension

Follow the instructions in `INSTALLATION.md` for your browser.

## 2. Verify the popup loads

1. Click the extension icon in the browser toolbar.
2. Verify the popup appears.
3. Enter a valid email address in the `Report email address` field.
4. Click `Save Email`.
5. Confirm `Report email saved.` appears.

## 3. Test URL-based detection

1. Open a new tab.
2. Go to a test URL that contains an explicit keyword, for example:
   - `https://example.com/porn-test`
   - `https://example.com/adult-content`
3. Wait a few seconds.
4. Confirm a browser notification appears.
5. Click the notification button.
6. A new email draft should open with the report address.

## 4. Test page content detection

1. Open a simple test page with explicit text in the body, for example create a local HTML file containing `porn` or `adult`.
2. Load the page in the browser.
3. Confirm the extension triggers a notification.

## 5. Test Instagram detection

1. Open `https://www.instagram.com`.
2. Navigate to a post or search result containing explicit hashtags or text.
3. Confirm the extension detects the content and shows a notification.

## 6. Troubleshooting

- If the extension does not load, verify `manifest.json` and `background.js` are present.
- If no notifications appear, make sure browser notifications are enabled.
- If the email draft does not open, ensure a default mail client is configured in the OS.
- If Firefox fails, use Chrome/Edge/Brave because Manifest V3 support is still limited.
