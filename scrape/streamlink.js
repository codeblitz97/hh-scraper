const puppeteer = require('puppeteer');
const { BaseURL } = require('../config');
const fs = require('fs');
const uae = require('user-agent-array');

const ua = uae[(Math.random() * uae.length) | 0];

const getStreamLink = async (watchId) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent(ua);

  let streamLink;

  const url = `${BaseURL}/watch/${watchId}`;
  await page.goto(url, { waitUntil: 'networkidle2' });

  page.on('response', async (response) => {
    const l = response.url();
    if (l.includes('master.m3u8')) {
      streamLink = l;
      console.log(l);
    }
  });

  const pageContent = await page.content();
  fs.writeFileSync('index-loaded.html', pageContent);

  await browser.close();

  return { streamLink };
};

module.exports = { getStreamLink };
