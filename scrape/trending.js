const puppeteer = require('puppeteer');
const { BaseURL } = require('../config');
const uae = require('user-agent-array');
const createError = require('http-errors');

const ua = uae[(Math.random() * uae.length) | 0];

async function getTrendingMonth() {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    const customUserAgent = ua;
    await page.setUserAgent(customUserAgent);
    await page.goto(BaseURL);

    await page.waitForSelector(
      'body > div.wrap > div > div > div.c-page-content.style-1 > div > div > div > div.main-col.col-md-8.col-sm-8 > div > div.c-page > div > div > div > div > div:nth-child(2) > div.page-content-listing.item-big_thumbnail > div > div > div > div.owl-stage-outer > div > div.owl-item.active',
      { timeout: 7000 }
    );

    const data = await page.evaluate(() => {
      const items = document.querySelectorAll(
        'body > div.wrap > div > div > div.c-page-content.style-1 > div > div > div > div.main-col.col-md-8.col-sm-8 > div > div.c-page > div > div > div > div > div:nth-child(2) > div.page-content-listing.item-big_thumbnail > div > div > div > div.owl-stage-outer > div > div.owl-item.active'
      );
      const scrapedData = [];

      items.forEach((item) => {
        const title = item.querySelector('.post-title a').textContent.trim();
        const rating = item
          .querySelector('.post-total-rating .score')
          .textContent.trim();
        const image = item.querySelector('.item-thumb img').getAttribute('src');
        const href = item.querySelector('.post-title a').getAttribute('href');

        scrapedData.push({
          title,
          rating,
          image,
          href,
        });
      });

      return scrapedData;
    });

    await browser.close();
    return data;
  } catch (error) {
    console.error(error);
    throw createError(500, 'Internal Server Error');
  }
}

module.exports = { getTrendingMonth };
