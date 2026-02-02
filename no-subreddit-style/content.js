/* ─────────────────────────────────────────────────────────────────────
 *  Works with <input id="res-style-checkbox" …>
 *  Stops watching after it has un‑checked the box.
 * ───────────────────────────────────────────────────────────────────── */

(() => {
  const POLL_INTERVAL_MS = 2000; 

  /* ----------------------------------------------------------------
   *   Find the checkbox
   * ---------------------------------------------------------------- */

  const findCheckbox = () =>
    document.querySelector('#res-style-checkbox') ||
    document.querySelector('input[name="res-style-checkbox"]');

  /* ----------------------------------------------------------------
   *   Uncheck once, then stop everything
   * ---------------------------------------------------------------- */
  const uncheckOnce = () => {
    const cb = findCheckbox();

    if (!cb) {
      console.log('[Auto‑Disable Subreddit Styles] ❌ Checkbox not present yet');
      return false;   
    }

    if (!cb.checked) {
      console.log('[Auto‑Disable Subreddit Styles] ✔️ Already unchecked – nothing to do');
      return true;  
    }

    console.log('[Auto‑Disable Subreddit Styles] ⚙️ Found checkbox – unchecking');

    // Open the View‑dropdown if the checkbox is hidden
    const viewBtn = document.querySelector('.view-dropdown');
    if (viewBtn && !viewBtn.classList.contains('open')) {
      viewBtn.click();
      console.log('[Auto‑Disable Subreddit Styles] ➡️ View‑dropdown opened');
    }

    setTimeout(() => {
      cb.click();   // toggles to unchecked
      console.log('[Auto‑Disable Subreddit Styles] ⏱️ Clicked – state now:', cb.checked);
    }, 150);

    return true;      // finished – no need to keep polling
  };

  /* ----------------------------------------------------------------
   *   Run immediately; keep trying until we succeed
   * ---------------------------------------------------------------- */

  let finished = false;
  const maxRetries = 5;   
  let attempts = 0;

  const tryOnce = () => {
    if (finished) return;            // already done
    const done = uncheckOnce();
    attempts++;
    if (done || attempts >= maxRetries) {
      finished = true;               // stop all watching
      console.log('[Auto‑Disable Subreddit Styles] ✅ Done (or max retries reached)');
    }
  };

  tryOnce();           // first attempt
  const intervalId = setInterval(() => {
    if (!finished) tryOnce();
    else clearInterval(intervalId); 
  }, POLL_INTERVAL_MS);

})();