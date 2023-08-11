import { Page } from '@playwright/test';

export async function setPageHidden(page: Page, hidden = true) {
  const setHidden = (html: HTMLElement, value: boolean) => {
    const doc = html.ownerDocument;
    Object.defineProperty(doc, 'visibilityState', {
      value: value ? 'hidden' : 'visible',
      writable: true,
    });
    Object.defineProperty(doc, 'hidden', { value, writable: true });
    doc.dispatchEvent(new Event('visibilitychange', { bubbles: true }));
  };

  await Promise.all([
    page.locator(':root').evaluate(setHidden, hidden),
    page.frameLocator('iframe').locator(':root').evaluate(setHidden, hidden),
  ]);
}
