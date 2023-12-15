const axios = require('axios').default;
const userAgentArray = require('user-agent-array');
const cheerio = require('cheerio');
const config = require('../config');
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
    const episodeCount = $('li.wp-manga-chapter').length;

    for (let i = 1; i <= episodeCount; i++) {
      const episodeId = `${id}/episode-${i}`;

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
      return { message, statusCode };
    } else {
      console.error(error);
      return { message: 'An error occurred', statusCode: 500 };
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
    countrate: parseInt($('span#countrate').text(), 10) || null,
  };
}

module.exports = { getInfo };
