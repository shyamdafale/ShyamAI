# Stop The Addiction — Installation & Run Guide

This guide explains how to install the Stop The Addiction browser extension on supported browsers and how to run it.

## Supported browsers
- Google Chrome
- Microsoft Edge
- Brave Browser
- Opera
- Firefox (temporary install only; MV3 support is limited)

## Install steps for Chrome / Edge / Brave / Opera

1. Open the browser.
2. Navigate to the extensions page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
   - Opera: `opera://extensions`
3. Enable `Developer mode` (usually a toggle in the top-right).
4. Click `Load unpacked` or `Load unpacked extension`.
5. Select the folder:
   - `e:\Shyam AI\ShyamAI\BrowserPlugins\StopTheAddiction`
6. The extension should appear in the extensions list.
7. Pin the extension icon to the toolbar if you want quick access.
8. If you want the extension to detect content on local files, click `Details` and enable `Allow access to file URLs`.

## Install steps for Firefox

1. Open Firefox.
2. Go to `about:debugging#/runtime/this-firefox`.
3. Click `Load Temporary Add-on`.
4. Select the file `manifest.json` from the folder:
   - `e:\Shyam AI\ShyamAI\BrowserPlugins\StopTheAddiction\manifest.json`
5. Firefox will load the extension temporarily until the browser is closed.

> Note: Firefox has limited support for Manifest V3. If the extension does not run correctly in Firefox, use Chrome-based browsers instead.

## How to run the extension

- After installation, the extension starts automatically.
- It monitors websites for explicit or unsafe keywords in the URL and page text.
- When suspicious content is detected, it creates a desktop notification.
- Click the notification button to open an email draft to the configured report address.
- Use the popup UI to set the report email address.

## Using the popup

1. Click the extension icon in the browser toolbar.
2. Enter the email address where reports should be sent.
3. Click `Save Email`.
4. Optionally click `Report current page` to report the open page manually.

## Testing the extension

Try the following after installation:
- Visit a website URL containing terms like `porn`, `adult`, `xxx`, or `nude`.
- Visit an Instagram page and look for explicit hashtags or content.
- Confirm that a notification appears.
- Click the notification action to open an email draft.

## Notes

- The extension uses `mailto:` reporting, which opens the default mail client for reporting.
- If you need automatic server-side email sending, a backend service must be added separately.
- This guide assumes the extension folder is located at `e:\Shyam AI\ShyamAI\BrowserPlugins\StopTheAddiction`.

## Troubleshooting

- If the extension does not appear after `Load unpacked`, verify the selected folder contains `manifest.json`.
- If notifications are blocked, enable notifications for the browser and allow the extension.
- If Firefox fails to load the extension, use Chrome or Edge.
