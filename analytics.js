/* Lightweight, best-effort page-view tracking for the admin Analytics tab.
   Fires once per page load; silently does nothing if the backend isn't
   configured or the request fails, so it can never affect the visitor. */
(function () {
  'use strict';
  var apiBase = (window.SITE_CONFIG && window.SITE_CONFIG.apiBase) || '';
  if (!apiBase) return;
  var host = location.hostname;
  if (!host || host === 'localhost' || host === '127.0.0.1') return; // keep local dev out of real analytics

  fetch(apiBase + '/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: location.pathname + location.hash, referrer: document.referrer }),
  }).catch(function () { /* analytics is best-effort only */ });
})();
