# Proof of Working Extension

Follow these steps to verify that the extension works correctly.

## 1. Load the extension
1. Open Chrome or Edge.
2. Go to `chrome://extensions` or `edge://extensions`.
3. Enable `Developer mode`.
4. Click `Load unpacked`.
5. Select `e:\Shyam AI\ShyamAI\BrowserPlugins\StopTheAddiction`.
6. Confirm the extension appears in the list.

## 2. Set the report email
1. Click the extension icon.
2. Enter a valid email address.
3. Click `Save Email`.
4. Confirm the message `Report email saved.` appears.

## 3. Verify detection on a test page
1. Open `test-page.html` from the extension folder in the browser, e.g. `file:///e:/Shyam AI/ShyamAI/BrowserPlugins/StopTheAddiction/test-page.html`.
2. Wait 2–3 seconds.
3. You should see a notification from the extension.
4. Click `Report via Email` on the notification.
5. An email draft should open in your default mail client.

> If you are not seeing any notification on local files, enable `Allow access to file URLs` in the extension details.

## 4. Verify detection on an explicit URL
1. Open a new tab.
2. Enter a URL containing explicit text, such as `https://example.com/porn-test`.
3. Wait 2–3 seconds.
4. A notification should appear.

## 5. Proof by browser logs
1. In `chrome://extensions`, click `Details` for Stop The Addiction.
2. Click `Service worker` under `Inspect views`.
3. In the console, you should see `Stop The Addiction background service worker started` when the extension loads.
4. When the test page triggers detection, you should also see a console message similar to:
   - `Stop The Addiction detected explicit content: Page content contains explicit keywords`

## 6. Expected proof outcome
- The extension appears in the browser extensions list.
- A notification appears after opening the test page.
- Clicking `Report via Email` opens a mailto draft.
- The background console logs show startup and detection messages.

## 5. Enable browser console logging
1. On `chrome://extensions`, click `Details` for Stop The Addiction.
2. Enable `Service worker` or `Inspect views: background page`.
3. Watch the console for messages such as `Stop The Addiction background service worker started` and `Stop The Addiction detected explicit content`.

## 6. Notes
- The extension uses `mailto:` reporting because direct email send requires a backend.
- `chrome.notifications` may require browser notification permissions to be enabled.
