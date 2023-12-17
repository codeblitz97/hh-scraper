const axios = require('axios').default;
const { load } = require('cheerio');
const uae = require('user-agent-array');
const createError = require('http-errors');
const { BaseURL } = require('../config');

const ua = uae[(Math.random() * uae.length) | 0];

const getTrending = async (page = 1, limit = 10, type = 'monthly') => {
  try {
    let uniqueSet = new Set();
    let trendingArr = [];
    let url = '';
    const startIndex = (page - 1) * limit;

    if (page <= 1 && type.toLowerCase() === 'monthly') {
      url = `${BaseURL}/browse/trending`;
    } else if (page > 1 && type.toLowerCase() === 'monhtly') {
      url = `${BaseURL}/browse/trending/page/${page}`;
    } else if (page <= 1 && type.toLowerCase() === 'all_time') {
      url = `${BaseURL}/browse/trending/?order=all`;
    } else if (page > 1 && type.toLowerCase() === 'all_time') {
      url = `${BaseURL}/browse/trending/page/${page}/?order=all`;
    } else {
      url = `${BaseURL}/browse/trending/`;
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
      'body > div.wrap > div > div > div.browse > div'
    );

    element.each((index, el) => {
      const divs = loadedCheerioData(el).find('div:nth-child(3) > div');
      divs.each((index, elm) => {
        const title = loadedCheerioData(elm).find('.h_cover > a').attr('title');
        const watchId = loadedCheerioData(elm)
          .find('.h_cover > a')
          .attr('href');
        const id = watchId?.split('/watch/')[1].replace('/', '');

        const image = loadedCheerioData(elm)
          .find('.h_cover > a > img')
          .attr('src')
          ?.replace(/\s/g, '%20');

        if (title && image && id) {
          const obj = {
            id: id,
            title: title,
            image: image,
            url: watchId,
          };

          if (!uniqueSet.has(obj.id) && trendingArr.length < limit) {
            uniqueSet.add(obj.id);
            trendingArr.push(obj);
          }
        }
      });
    });

    return trendingArr;
  } catch (error) {
    throw createError(500, error?.message);
  }
};

module.exports = { getTrending };
