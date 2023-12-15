const axios = require('axios').default;
const uae = require('user-agent-array');
const { load } = require('cheerio');
const { BaseURL } = require('../config');

const ua = uae[(Math.random() * uae.length) | 0];

const searchData = async (page = 1, query = '') => {
  let url;
  let results = [];

  try {
    if (page <= 1 && query === '') {
      url = `${BaseURL}/?s=`;
    } else if (page <= 1 && query !== '') {
      url = `${BaseURL}/?s=${query}`;
    } else {
      url = `${BaseURL}/?s=${query}/page/${page}`;
    }

    const response = await axios.get(`${url}`, {
      headers: { 'User-Agent': ua },
    });
    const data = await response.data;
    const loadedCheerioData = load(data);

    const informationDivs = loadedCheerioData(
      '.tab-content-wrap .c-tabs-item__content'
    );

    informationDivs.map((index, element) => {
      const div = loadedCheerioData(element);
      const imageUrl = div
        .find('.tab-thumb img')
        .attr('src')
        ?.replace(/\s/g, '%20');
      const title = div.find('.tab-summary .post-title a').text().trim();
      const href = div.find('.tab-summary .post-title a').attr('href');
      const id = href?.split('/watch/')[1].replace('/', '');

      const alternativeNames = div
        .find('.mg_alternative .summary-content')
        .text()
        .trim();
      const author = div.find('.mg_author .summary-content a').text().trim();
      const releaseYear = div
        .find('.mg_release .summary-content a')
        .text()
        .trim();

      const genres = [];
      div.find('.mg_genres .summary-content a').each((index, genre) => {
        genres.push(loadedCheerioData(genre).text().trim());
      });

      results.push({
        id,
        title,
        watchId: href,
        alternativeNames,
        author,
        imageUrl,
        releaseYear,
        genres,
      });
    });

    return results;
  } catch (error) {
    console.error(error);
    return { message: '' };
  }
};

module.exports = { searchData };
