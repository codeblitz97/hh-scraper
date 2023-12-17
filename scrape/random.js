const axios = require('axios').default;
const uae = require('user-agent-array');
const { load } = require('cheerio');
const { BaseURL } = require('../config');
const createError = require('http-errors');

const ua = uae[(Math.random() * uae.length) | 0];

const getRandom = async (page = 1, limit = 7) => {
  let url;
  let randArr = [];
  const uniqueSet = new Set();

  try {
    const startIndex = (page - 1) * limit;

    if (page <= 1) {
      url = `${BaseURL}/browse/random`;
    } else {
      url = `${BaseURL}/browse/random/page/${page}`;
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
      'body > div.wrap > div > div > div.browse > div > div'
    );

    element.each((index, el) => {
      const divs = loadedCheerioData(el).find('div.accordion_h');
      console.log(divs.html());
      divs.each((index, elm) => {
        const watchId = loadedCheerioData(elm).find('a').attr('href');
        const bgImgSt = loadedCheerioData(elm)
          .find('.acc_bg_image')
          .attr('style');

        const match = bgImgSt.match(/url\('([^']+)'\)/);

        const bgImage = match && match[1];
        const hId = loadedCheerioData(elm).find('.acc_data > a').attr('href');

        const id = hId?.split('/watch/')[1].replace('/', '');

        const image = loadedCheerioData(elm)
          .find('.ah_cover')
          .attr('src')
          ?.replace(/\s/g, '%20');

        const title = loadedCheerioData(elm).find('.ah_cover').attr('alt');

        const dateRelease = loadedCheerioData(elm)
          .find('.acc_info > span')
          .text();

        if (title && image && id) {
          const obj = {
            id,
            title,
            image,
            epUrl: watchId,
            dateRelease,
            bgImage,
            url: hId,
          };

          if (!uniqueSet.has(obj.id) && randArr.length < limit) {
            uniqueSet.add(obj.id);
            randArr.push(obj);
          }
        }
      });
    });

    return randArr;
  } catch (error) {
    console.error(error);
    throw createError(500, 'Internal Server Error');
  }
};

module.exports = { getRandom };
