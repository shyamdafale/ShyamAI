const explicitKeywords = [
  "porn", "adult", "xxx", "sex", "nude", "nudity", "hardcore", "explicit", "fetish", "bdsm", "softcore"
];
const blockedSites = [
  "pornhub.com", "xvideos.com", "xhamster.com", "xnxx.com", "redtube.com", "youporn.com", "tube8.com", "xnxx.tv"
];

function normalizeUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch (error) {
    return url.toLowerCase();
  }
}

function isExplicitUrl(tabUrl) {
  if (!tabUrl) return false;
  const lower = tabUrl.toLowerCase();
  if (blockedSites.some(site => lower.includes(site))) {
    return true;
  }
  return explicitKeywords.some(keyword => lower.includes(keyword));
}

function getReportEmail(callback) {
  chrome.storage.local.get({ reportEmail: "report@example.com" }, data => {
    callback(data.reportEmail);
  });
}

const activeNotifications = {};

function storeNotificationData(notificationId, data) {
  activeNotifications[notificationId] = data;
}

function retrieveNotificationData(notificationId) {
  return activeNotifications[notificationId];
}

function clearNotificationData(notificationId) {
  delete activeNotifications[notificationId];
}

const notificationIconUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAKUlEQVR42mNgoAWMgBgwYHDYw0xPDAwMDAwMDAwMDAwMDAwMDBg4GAwAQB5oYIDPZPYoAAAAAElFTkSuQmCC";

function createNotification(tabId, pageUrl, source, message) {
  const notificationId = `stop-addiction-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  storeNotificationData(notificationId, { pageUrl, source });
  const options = {
    type: "basic",
    iconUrl: notificationIconUrl,
    title: "Stop The Addiction Alert",
    message,
    buttons: [{ title: "Report via Email" }],
    priority: 2
  };
  // Send an in-page toast to the tab (more reliable than chrome.notifications
  // when image downloads fail). The content script will render the toast.
  if (tabId != null) {
    chrome.tabs.sendMessage(tabId, { type: "SHOW_TOAST", pageUrl, source, message });
  }
}

chrome.notifications.onButtonClicked.addListener((nid, buttonIndex) => {
  if (buttonIndex !== 0) return;
  const data = retrieveNotificationData(nid);
  if (!data) return;
  clearNotificationData(nid);
  const { pageUrl, source } = data;
  getReportEmail(email => {
    const subject = encodeURIComponent("Safety report: suspicious content detected");
    const body = encodeURIComponent(`A page or URL matching explicit content was detected by Stop The Addiction plugin.\n\nSource: ${source}\nPage URL: ${pageUrl}\n\nPlease review the content and take appropriate action.`);
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    chrome.tabs.create({ url: mailtoUrl });
  });
});

function reportSuspiciousTab(tab, reason, explicitWords = []) {
  if (!tab || !tab.url) return;
  createNotification(tab.id, tab.url, reason, `Suspicious content detected: ${reason}`);
  // Offline-only mode: always save report locally (Downloads/server receiver can pick it up).
  try {
    collectAndSaveReport(tab, reason, explicitWords);
  } catch (e) {
    console.warn('collectAndSaveReport call failed', e);
  }
}

// Handle manual reports coming from popup (use same fallback logic)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === 'MANUAL_REPORT') {
    const { pageUrl, subject, body, tabId } = message;
    // Offline-only: always save manual reports locally
    try {
      const tab = { id: tabId, url: pageUrl };
      collectAndSaveReport(tab, 'Manual report');
      sendResponse({ ok: true, saved: 'downloads' });
    } catch (err) {
      sendResponse({ ok: false, error: err && err.message });
    }
    return false;
  }
});

function fetchIpInfo() {
  return fetch('https://ipwho.is/')
    .then(async res => {
      if (!res.ok) {
        throw new Error(`IP lookup failed: ${res.status}`);
      }
      const json = await res.json();
      if (json.success === false) {
        throw new Error(json.message || 'IP lookup service returned failure');
      }
      return {
        ip: json.ip,
        city: json.city,
        region: json.region,
        country: json.country,
        country_code: json.country_code,
        latitude: json.latitude,
        longitude: json.longitude,
        org: json.organization,
        timezone: json.timezone?.id
      };
    })
    .catch(() => {
      return fetch('https://api.ipify.org?format=json')
        .then(async res => {
          if (!res.ok) {
            throw new Error(`IP fallback failed: ${res.status}`);
          }
          const json = await res.json();
          return { ip: json.ip };
        });
    });
}

// Collect IP/location from a public API and save a JSON report to Downloads.
function collectAndSaveReport(tab, reason, explicitWords = []) {
  try {
    fetchIpInfo()
      .then(ipData => {
        const payload = {
          pageUrl: tab.url,
          source: reason,
          detectedAt: new Date().toISOString(),
          explicitWords,
          ipInfo: ipData,
          userAgent: navigator.userAgent
        };
        saveReportJson(tab, payload);
      })
      .catch(err => {
        console.warn('IP fetch failed:', err);
        const fallbackPayload = {
          pageUrl: tab.url,
          source: reason,
          detectedAt: new Date().toISOString(),
          explicitWords,
          ipInfo: { error: err.message || 'IP lookup failed' },
          userAgent: navigator.userAgent
        };
        saveReportJson(tab, fallbackPayload);
      });
  } catch (e) {
    console.warn('collectAndSaveReport error', e);
    const fallbackPayload = {
      pageUrl: tab.url,
      source: reason,
      detectedAt: new Date().toISOString(),
      explicitWords,
      ipInfo: { error: e.message || 'IP lookup failed' },
      userAgent: navigator.userAgent
    };
    saveReportJson(tab, fallbackPayload);
  }
}

function saveReportJson(tab, payload) {
  const json = JSON.stringify(payload, null, 2);
  const dataUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(json);
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `StopTheAddiction-abc-${ts}.json`;
  chrome.downloads.download({ url: dataUrl, filename: filename, conflictAction: 'uniquify', saveAs: false }, downloadId => {
    if (chrome.runtime.lastError) {
      console.warn('Download failed:', chrome.runtime.lastError.message);
      if (tab && tab.id != null) chrome.tabs.sendMessage(tab.id, { type: 'SHOW_TOAST', message: 'Failed to save report to Downloads.' });
    } else {
      if (tab && tab.id != null) chrome.tabs.sendMessage(tab.id, { type: 'SHOW_TOAST', message: 'Report saved to Downloads.' });
    }
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!tab || !tab.url) return;
  if (changeInfo.status === "complete" || changeInfo.url) {
    if (isExplicitUrl(tab.url)) {
      reportSuspiciousTab(tab, "Explicit URL detected");
    }
  }
});

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    if (!tab || !tab.url) return;
    if (isExplicitUrl(tab.url)) {
      reportSuspiciousTab(tab, "Explicit URL detected");
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "EXPLICIT_CONTENT_DETECTED") {
    reportSuspiciousTab(sender.tab, message.reason || "Explicit page content detected", message.explicitWords || []);
    sendResponse({ received: true });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["reportEmail"], data => {
    if (!data.reportEmail) {
      chrome.storage.local.set({ reportEmail: "report@example.com" });
    }
    // force offline-only by default
    chrome.storage.local.set({ reportAlwaysLocal: true });
  });
});

console.log("Stop The Addiction background service worker started");
