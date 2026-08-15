const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER_LOG:' + msg.type() + ':' + msg.text()));
  const popupPromise = page.waitForEvent('popup', { timeout: 20000 }).catch(() => null);
  await page.goto('https://firstinteriors.in', { waitUntil: 'networkidle', timeout: 30000 });
  const btn = page.locator('button:has-text("Contact via WhatsApp")').first();
  console.log('BUTTON_COUNT=' + await btn.count());
  if (await btn.count()) {
    await btn.click();
    const popup = await popupPromise;
    if (popup) {
      console.log('POPUP_URL=' + popup.url());
      await popup.waitForLoadState('domcontentloaded').catch(() => {});
      console.log('POPUP_TITLE=' + await popup.title().catch(() => 'NO_TITLE'));
    } else {
      console.log('NO_POPUP');
      console.log('CURRENT_URL=' + page.url());
    }
  }
  await browser.close();
})();
