import playwright from 'playwright';
import { chunkHtml, filterChunksWithReviews } from '../helpers/chunkHtml.js';
import { extractSelectors } from '../helpers/extractSelectors.js';

export const scrapeReviews = async (url, numReviews) => {
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage();
  let allReviews = [];
  let selectors = null;

  await page.goto(url);
  await page.waitForSelector('body');

  const closePopupSelector = '.store-selection-popup--close';
  const popupCloseButton = await page.$(closePopupSelector);
  if (popupCloseButton) {
    await popupCloseButton.click();
    await page.waitForTimeout(1000);
  }

  while (allReviews.length < numReviews) {
    const fullHtml = await page.content();

    if (!selectors) {
      const htmlChunks = chunkHtml(fullHtml);
      const reviewChunks = filterChunksWithReviews(htmlChunks);
      selectors = await extractSelectors(reviewChunks);

      if (!Object.keys(selectors).length) {
        throw new Error('Selectors not found.');
      }
    }

    const reviews = await page.evaluate((selectors) => {
      const reviewElements = document.querySelectorAll(selectors.container);
      return Array.from(reviewElements).map((review) => ({
        reviewer: review.querySelector(selectors.name)?.textContent?.trim() || '',
        rating: parseInt(
          review.querySelector(selectors.rating)?.getAttribute('aria-label')?.match(/(\d+)/)?.[1] || '0',
          10
        ),
        body: review.querySelector(selectors.review)?.textContent?.trim() || '',
        date: review.querySelector(selectors.date)?.textContent?.trim() || '',
      }));
    }, selectors);

    allReviews.push(...reviews);

    const nextPageButton = await page.$(selectors.nextPageSelector);
    if (nextPageButton) {
      await nextPageButton.click();
      await page.waitForTimeout(3000);
    } else {
      break;
    }
  }

  await browser.close();
  return allReviews.slice(0, numReviews);
};
