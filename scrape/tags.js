const axios = require('axios').default;
const { load } = require('cheerio');
const { BaseURL } = require('../config');
const uae = require('user-agent-array');
const createError = require('http-errors');

const ua = uae[(Math.random() * uae.length) | 0];

const getTags = async () => {
  try {
    let tagsArr = [];
    const response = await axios.get(BaseURL, {
      headers: { 'User-Agent': ua },
    });

    if (!response || !response.data) {
      throw createError(500, 'Failed to fetch data');
    }

    const $ = load(response.data);

    $('#tag_cloud-2 > div > div.tagcloud > a').each((index, element) => {
      const tag = $(element).text().trim();
      tagsArr.push(tag);
    });

    return tagsArr;
  } catch (error) {
    console.error(error);
    throw createError(500, 'Internal Server Error');
  }
};

module.exports = { getTags };
