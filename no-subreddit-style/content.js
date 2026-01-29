/**
 * 1️⃣  Find the “Use subreddit style” link inside the RES “View” dropdown.
 * 2️⃣  If it’s not already selected, click it.
 *
 * The script runs a small polling loop (once every 2 s) and also
 * watches the DOM for changes – good for pages that load content
 * dynamically or for users who click the “View” button after load.
 */

(() => {
  const CHECK_INTERVAL_MS = 2000; // 2 seconds

  // Utility: trim & normalize text
  const normalize = str => str.trim().replace(/\s+/g, ' ');

  // 1️⃣  Locate the toggle button
  const findToggle = () => {
    // RES injects a <a> inside the View dropdown whose visible text
    // is exactly “Use subreddit style”.  We look for that text.
    const links = Array.from(document.querySelectorAll('a'));
    return links.find(el => normalize(el.textContent) === 'Use subreddit style');
  };

  // 2️⃣  Click the toggle if it isn’t active
  const clickToggleIfNeeded = () => {
    const toggle = findToggle();
    if (!toggle) return; // not yet rendered

    // In the RES menu, the active item gets a class “selected” (or
    // sometimes “is-active”).  If it’s already selected, do nothing.
    const isActive = toggle.classList.contains('selected') ||
                     toggle.classList.contains('is-active');
    if (isActive) return;

    // The View dropdown might be closed; if the <a> is hidden,
    // we need to open the dropdown first.
    if (!toggle.parentElement.closest('.view-dropdown').classList.contains('open')) {
      // Find the “View” button (usually has a class “view-dropdown”)
      const viewBtn = document.querySelector('.view-dropdown');
      if (viewBtn) viewBtn.click(); // open the menu
    }

    // Small delay to let the menu animate
    setTimeout(() => toggle.click(), 150);
  };

  // Run immediately once the page is idle
  clickToggleIfNeeded();

  // 3️⃣  Keep trying: DOM may change after dynamic loads
  const observer = new MutationObserver(() => clickToggleIfNeeded());
  observer.observe(document.body, { childList: true, subtree: true });

  // 4️⃣  As a safety net, also poll every CHECK_INTERVAL_MS
  setInterval(clickToggleIfNeeded, CHECK_INTERVAL_MS);
})();