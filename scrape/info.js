const axios = require('axios').default;
const userAgentArray = require('user-agent-array');
const cheerio = require('cheerio');
const config = require('../config');
const createError = require('http-errors');
const AxiosError = require('axios').AxiosError;

const getInfo = async (id) => {
  const uniqueSet = new Set();

  const url = `${config.BaseURL}/watch/${id}`;
  const userAgent =
    userAgentArray[Math.floor(Math.random() * userAgentArray.length)];

  let episodesArr = [];

  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': userAgent },
    });

    if (!response || !response.data) {
      throw createError(500, 'Failed to fetch data');
    }

    const $ = cheerio.load(response.data);

    const title = $('div.post-title > h1').text().trim();
    const imageElement = $('div.summary_image a img');
    const image =
      imageElement.length > 0
        ? imageElement.attr('src')?.replace(/\s/g, '%20')
        : null;
    const alternative = getTextFromElement(
      $,
      'div.post-content_item:contains("Alternative") .summary-content'
    );
    const author = getTextFromElement(
      $,
      'div.post-content_item:contains("Author(s)") .summary-content a'
    );
    const genres = getGenres($);
    const fapped = getFapped($);
    const description = getTextFromElement(
      $,
      '.description-summary .summary__content p'
    );
    const viewedCount = extractNumbersFromString(
      getTextFromElement($, 'div.summary-content:contains("Total views")')
    );

    const episodeCount = $('li.wp-manga-chapter').length;

    for (let i = 1; i <= episodeCount; i++) {
      const episodeId = `${id}/episode-${i}`;
      const epTittle = `${title} Episode ${i}`;

      const releaseDates = $('.chapter-release-date i');

      releaseDates.each((index, element) => {
        const releaseDate = $(element).text();

        const hsId = episodeId
          .replace(/episode-(\d)\//, (match, p1) => `episode-0${p1}/`)
          .replace(/\//g, '-')
          .replace(
            /(\d)(\/|$)/g,
            (match, p1, p2) => `${p1.padStart(2, '0')}${p2}`
          );

        const obj = {
          episodeTitle: epTittle,
          episodeId,
          releaseDate,
          hentaiStreamId: hsId,
        };

        if (!uniqueSet.has(obj.episodeId)) {
          uniqueSet.add(obj.episodeId);
          episodesArr.push(obj);
        }
      });
    }

    const info = {
      id,
      title,
      image,
      alternative,
      author,
      viewedCount,
      genres,
      fapped,
      description,
      episodes: episodesArr,
    };

    return info;
  } catch (error) {
    if (error instanceof AxiosError) {
      const statusCode = error.response ? error.response.status : 500;
      const message = error.response
        ? error.response.statusText
        : 'An error occurred';
      throw createError(statusCode, message);
    } else {
      console.error(error);
      throw createError(500, 'Internal Server Error');
    }
  }
};

function getTextFromElement($, selector) {
  const element = $(selector);
  return element.length > 0 ? element.text().trim() : null;
}

function getGenres($) {
  const genres = [];
  $('div.post-content_item:contains("Genre(s)") .summary-content a').each(
    (_, el) => {
      genres.push($(el).text().trim());
    }
  );
  return genres;
}

function getFapped($) {
  return {
    average: parseFloat($('span#averagerate').text()) || null,
    best: parseFloat($('span[property="bestRating"]').text()) || null,
    countrate: parseStringToNumber($('span#countrate').text()) || null,
  };
}

/**
 * @param {string} s
 */
function parseStringToNumber(s) {
  if (s.toLowerCase().endsWith('k')) {
    return parseFloat(s.slice(0, -1)) * 1000;
  } else {
    return parseFloat(s);
  }
}

/**
 * @param {string} str
 */
function extractNumbersFromString(str) {
  const numbersArray = str.match(/\d+/g);

  if (numbersArray && numbersArray.length > 0) {
    return parseInt(numbersArray[0], 10);
  } else {
    return null;
  }
}

module.exports = { getInfo };
