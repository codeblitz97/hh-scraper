const axios = require('axios').default;
const uae = require('user-agent-array');
const { load } = require('cheerio');
const { BaseURL } = require('../config');
const createError = require('http-errors');

const ua = uae[(Math.random() * uae.length) | 0];

const getRecents = async (page = 1, limit = 7) => {
  let url;
  let info = [];
  const uniqueSet = new Set();

  try {
    const startIndex = (page - 1) * limit;

    if (page <= 1) {
      url = `${BaseURL}/release/2023`;
    } else {
      url = `${BaseURL}/release/2023/page/${page}`;
    }

    const response = await axios.get(url, {
      headers: { 'User-Agent': ua },
    });

    if (!response || !response.data) {
      throw createError(500, 'Failed to fetch data');
    }

    const data = await response.data;
    const loadedCheerioData = load(data);
    const element = loadedCheerioData(
      'body > div.wrap > div > div > div.c-page-content.style-1 > div > div > div > div.main-col.col-md-8.col-sm-8 > div > div.c-page > div > div.tab-content-wrap > div > div'
    );

    element.each((index, el) => {
      const divs = loadedCheerioData(el).find('div');
      divs.each((index, elm) => {
        const title = loadedCheerioData(elm)
          .find('div > div.page-item-detail > div > a')
          .attr('title');
        const watchId = loadedCheerioData(elm)
          .find('div > div.page-item-detail > div > a')
          .attr('href');
        const id = watchId?.split('/watch/')[1].replace('/', '');

        const image = loadedCheerioData(elm)
          .find('div > div.page-item-detail > div > a > img')
          .attr('src')
          ?.replace(/\s/g, '%20');

        if (title && image && id) {
          const obj = {
            id: id,
            title: title,
            image: image,
            url: watchId,
          };

          if (!uniqueSet.has(obj.id) && info.length < limit) {
            uniqueSet.add(obj.id);
            info.push(obj);
          }
        }
      });
    });

    return info;
  } catch (error) {
    console.error(error);
    throw createError(500, 'Internal Server Error');
  }
};

module.exports = { getRecents };
