const explicitKeywords = [
  "porn", "adult", "xxx", "sex", "hot video", "nude", "nudes", "hardcore", "fetish", "explicit", "bdsm", "sexy"
];
const instagramKeywords = [
  "#porn", "#adult", "#xxx", "#nude", "#nudes", "#sexy", "#explicit"
];
let detectTimeout = null;

function pageTextIncludesKeyword(keywords) {
  const bodyText = document.body ? document.body.innerText.toLowerCase() : "";
  const titleText = document.title ? document.title.toLowerCase() : "";
  const urlText = window.location.href.toLowerCase();
  const text = `${titleText}\n${bodyText}\n${urlText}`;
  return keywords.some(keyword => text.includes(keyword));
}

function getKeywordsMatched(keywords) {
  const bodyText = document.body ? document.body.innerText.toLowerCase() : "";
  const titleText = document.title ? document.title.toLowerCase() : "";
  const urlText = window.location.href.toLowerCase();
  const text = `${titleText}\n${bodyText}\n${urlText}`;
  return keywords.filter(keyword => text.includes(keyword));
}

function detectExplicitContent() {
  const url = window.location.href.toLowerCase();
  let reason = null;
  let matchedWords = [];

  if (url.includes("instagram.com")) {
    matchedWords = [...new Set([...getKeywordsMatched(instagramKeywords), ...getKeywordsMatched(explicitKeywords)])];
    if (matchedWords.length) {
      reason = "Instagram content appears explicit";
    }
  } else {
    matchedWords = getKeywordsMatched(explicitKeywords);
    if (matchedWords.length) {
      reason = "Page content contains explicit keywords";
    }
  }

  if (reason) {
    console.log("Stop The Addiction detected explicit content:", reason, matchedWords, window.location.href);
    chrome.runtime.sendMessage({ type: "EXPLICIT_CONTENT_DETECTED", reason, explicitWords: matchedWords }, response => {
      if (chrome.runtime.lastError) {
        console.error("Messaging error:", chrome.runtime.lastError.message);
      }
    });
  }
}

function scheduleDetect() {
  if (detectTimeout) return;
  detectTimeout = setTimeout(() => {
    detectTimeout = null;
    detectExplicitContent();
  }, 500);
}

function observePageChanges() {
  const target = document.body || document.documentElement;
  if (!target) return;
  const observer = new MutationObserver(() => {
    scheduleDetect();
  });
  observer.observe(target, { childList: true, subtree: true });
}

function showInlineToast(message, pageUrl, source) {
  const existingToast = document.getElementById("stop-addiction-toast");
  if (existingToast) {
    existingToast.querySelector('.sa-message').textContent = message;
    return;
  }

  const toast = document.createElement("div");
  toast.id = "stop-addiction-toast";
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "16px",
    right: "16px",
    zIndex: 2147483647,
    padding: "12px 16px",
    background: "rgba(0, 0, 0, 0.85)",
    color: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
    fontSize: "14px",
    maxWidth: "360px",
    lineHeight: "1.4",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    gap: "8px",
    alignItems: "center"
  });

  const msg = document.createElement('div');
  msg.className = 'sa-message';
  msg.textContent = message;

  const reportBtn = document.createElement('button');
  reportBtn.textContent = 'Report';
  Object.assign(reportBtn.style, {
    background: '#ff4d4f',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px'
  });

  const providerSelect = document.createElement('select');
  Object.assign(providerSelect.style, { marginLeft: '8px', fontSize: '13px' });
  const opts = [
    ['default', 'Default mail app'],
    ['gmail', 'Gmail (web)'],
    ['outlook', 'Outlook (web)'],
    ['yahoo', 'Yahoo Mail (web)']
  ];
  opts.forEach(o => {
    const el = document.createElement('option'); el.value = o[0]; el.textContent = o[1]; providerSelect.appendChild(el);
  });
  // populate with stored default provider if present
  try {
    chrome.storage.local.get(['reportProvider'], data => {
      if (data && data.reportProvider) {
        providerSelect.value = data.reportProvider;
      }
    });
  } catch (e) {
    // ignore
  }

  const saveDefaultLabel = document.createElement('label');
  saveDefaultLabel.style.display = 'flex';
  saveDefaultLabel.style.alignItems = 'center';
  saveDefaultLabel.style.marginLeft = '8px';
  saveDefaultLabel.style.fontSize = '12px';
  const saveDefaultCheckbox = document.createElement('input');
  saveDefaultCheckbox.type = 'checkbox';
  saveDefaultCheckbox.style.marginRight = '6px';
  saveDefaultLabel.appendChild(saveDefaultCheckbox);
  saveDefaultLabel.appendChild(document.createTextNode('Save as default'));

  function openCompose(provider, email, subject, body) {
    const subj = encodeURIComponent(subject || 'Report: suspicious content detected');
    const bod = encodeURIComponent(body || `Source: ${source}\nPage URL: ${pageUrl}`);
    const to = encodeURIComponent(email || '');
    try {
      if (provider === 'gmail') {
        const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subj}&body=${bod}`;
        window.open(url, '_blank');
      } else if (provider === 'outlook') {
        const url = `https://outlook.live.com/owa/?path=/mail/action/compose&to=${to}&subject=${subj}&body=${bod}`;
        window.open(url, '_blank');
      } else if (provider === 'yahoo') {
        const url = `https://compose.mail.yahoo.com/?to=${to}&subject=${subj}&body=${bod}`;
        window.open(url, '_blank');
      } else {
        window.open(`mailto:${email}?subject=${subj}&body=${bod}`, '_blank');
      }
    } catch (e) {
      window.open(`mailto:${email || 'report@example.com'}?subject=${subj}&body=${bod}`, '_blank');
    }
  }

  reportBtn.addEventListener('click', () => {
    chrome.storage.local.get(['reportEmail', 'reportProvider'], data => {
      const email = (data && data.reportEmail) ? data.reportEmail : 'report@example.com';
      const defaultProvider = (data && data.reportProvider) ? data.reportProvider : 'default';
      const chosen = providerSelect.value || defaultProvider || 'default';
      const subject = 'Report: suspicious content detected';
      const body = `Source: ${source}\nPage URL: ${pageUrl}`;
      openCompose(chosen, email, subject, body);
      if (saveDefaultCheckbox.checked) {
        try {
          chrome.storage.local.set({ reportProvider: chosen });
        } catch (e) {
          // ignore storage errors silently
        }
      }
    });
  });

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  Object.assign(closeBtn.style, {
    background: 'transparent',
    color: 'white',
    border: 'none',
    fontSize: '18px',
    lineHeight: '1',
    cursor: 'pointer',
    padding: '0 8px',
    marginLeft: 'auto'
  });
  closeBtn.addEventListener('click', () => {
    toast.remove();
  });

  toast.appendChild(msg);
  toast.appendChild(reportBtn);
  toast.appendChild(providerSelect);
  toast.appendChild(saveDefaultLabel);
  toast.appendChild(closeBtn);
  document.documentElement.appendChild(toast);

  setTimeout(() => { toast.remove(); }, 8000);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SHOW_TOAST") {
    showInlineToast(message.message || 'Suspicious content detected', message.pageUrl, message.source);
  }
});

function initDetection() {
  detectExplicitContent();
  observePageChanges();
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  initDetection();
} else {
  window.addEventListener("load", initDetection);
}
