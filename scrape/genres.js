const axios = require('axios').default;
const { load } = require('cheerio');
const { BaseURL } = require('../config');
const uae = require('user-agent-array');
const createError = require('http-errors');

const ua = uae[(Math.random() * uae.length) | 0];

const getGenres = async () => {
  try {
    let genresArr = [];
    const response = await axios.get(BaseURL, {
      headers: { 'User-Agent': ua },
    });

    if (!response || !response.data) {
      throw createError(500, 'Failed to fetch data');
    }

    const $ = load(response.data);

    $('#tag_cloud-5 > div > div.tagcloud a').each((index, element) => {
      const tag = $(element).text().trim();
      genresArr.push(tag);
    });

    return genresArr;
  } catch (error) {
    console.error(error);
    throw createError(500, 'Internal Server Error');
  }
};

module.exports = { getGenres };
