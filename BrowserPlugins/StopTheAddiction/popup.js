const reportEmailInput = document.getElementById("reportEmail");
const reportProviderSelect = document.getElementById("reportProvider");
const reportEndpointInput = document.getElementById("reportEndpoint");
const reportAlwaysLocalInput = document.getElementById("reportAlwaysLocal");

// Offline-only mode: disable endpoint input to avoid confusion
if (reportEndpointInput) reportEndpointInput.disabled = true;
const saveButton = document.getElementById("saveButton");
const reportButton = document.getElementById("reportButton");
const status = document.getElementById("status");

function showStatus(message, duration = 3000) {
  status.textContent = message;
  setTimeout(() => { status.textContent = ""; }, duration);
}

chrome.storage.local.get(["reportEmail", "reportProvider"], data => {
  if (data.reportEmail) reportEmailInput.value = data.reportEmail;
  if (data.reportProvider) reportProviderSelect.value = data.reportProvider;
  if (data.reportEndpoint) reportEndpointInput.value = data.reportEndpoint;
  if (data.reportAlwaysLocal) reportAlwaysLocalInput.checked = !!data.reportAlwaysLocal;
});

saveButton.addEventListener("click", () => {
  const email = reportEmailInput.value.trim();
  if (!email) {
    showStatus("Please enter a valid email address.");
    return;
  }
  const provider = reportProviderSelect.value || 'default';
  const endpoint = (reportEndpointInput && reportEndpointInput.value && reportEndpointInput.value.trim()) ? reportEndpointInput.value.trim() : '';
  const alwaysLocal = reportAlwaysLocalInput && reportAlwaysLocalInput.checked;
  chrome.storage.local.set({ reportEmail: email, reportProvider: provider, reportEndpoint: endpoint, reportAlwaysLocal: alwaysLocal }, () => {
    showStatus("Report settings saved.");
  });
});

function openCompose(provider, email, subject, body) {
  const subj = encodeURIComponent(subject);
  const bod = encodeURIComponent(body);
  const to = encodeURIComponent(email || '');
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
}

reportButton.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (!tabs.length) {
      showStatus("No active tab available.");
      return;
    }
    const tab = tabs[0];
    chrome.storage.local.get(["reportEmail", "reportProvider"], data => {
        const email = (data && data.reportEmail) ? data.reportEmail : "report@example.com";
        const provider = (data && data.reportProvider) ? data.reportProvider : 'default';
        const endpoint = (data && data.reportEndpoint) ? data.reportEndpoint : '';
        const subject = "Manual report: suspicious page detected";
        const body = `Please review this page for explicit or harmful content:\n\n${tab.url}`;
        // Route manual reporting through the background so it can fallback to Downloads when needed.
        chrome.runtime.sendMessage({ type: 'MANUAL_REPORT', pageUrl: tab.url, subject, body, tabId: tab.id }, resp => {
          if (chrome.runtime.lastError) {
            showStatus('Error sending manual report.');
            return;
          }
          if (resp && resp.ok) {
            showStatus('Report sent to endpoint.');
          } else if (resp && resp.fallback === 'downloads') {
            showStatus('Endpoint unavailable — saved report to Downloads.');
          } else {
            // Fallback to open compose if endpoint isn't configured
            openCompose(provider, email, subject, body);
          }
        });
    });
  });
});
