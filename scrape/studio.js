const axios = require('axios').default;
const { load } = require('cheerio');
const uae = require('user-agent-array');
const createError = require('http-errors');
const { BaseURL } = require('../config');

const ua = uae[(Math.random() * uae.length) | 0];

const getStudio = async (studioName, page = 1, limit = 10) => {
  try {
    let uniqueSet = new Set();
    let studioArr = [];
    let url = '';
    const startIndex = (page - 1) * limit;

    if (page <= 1) {
      url = `${BaseURL}/studio/${studioName}`;
    } else {
      url = `${BaseURL}/studio/${studioName}`;
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
      'body > div.wrap > div > div > div.c-page-content.style-1 > div > div > div > div.main-col.col-md-8.col-sm-8 > div > div.c-page > div > div.tab-content-wrap > div > div > div'
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

          if (!uniqueSet.has(obj.id) && studioArr.length < limit) {
            uniqueSet.add(obj.id);
            studioArr.push(obj);
          }
        }
      });
    });

    return studioArr;
  } catch (error) {
    throw createError(500, error?.message);
  }
};

module.exports = { getStudio };
