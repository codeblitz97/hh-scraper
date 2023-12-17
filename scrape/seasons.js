const axios = require('axios');
const cheerio = require('cheerio');
const { BaseURL } = require('../config');
const uae = require('user-agent-array');
const createError = require('http-errors');

const ua = uae[(Math.random() * uae.length) | 0];

function getSeason(month) {
  if (month >= 3 && month <= 5) {
    return 'Spring';
  } else if (month >= 6 && month <= 8) {
    return 'Summer';
  } else if (month >= 9 && month <= 11) {
    return 'Autumn';
  } else {
    return 'Winter';
  }
}

const currentMonth = new Date().getMonth() + 1;
const currentSeason = `${getSeason(currentMonth)} 2023`;

async function getSeasons(season = currentSeason.toString()) {
  try {
    const response = await axios.get(`${BaseURL}/browse/seasons`, {
      headers: { 'User-Agent': ua },
    });

    const $ = cheerio.load(response.data);

    const scrapedData = [];
    const accordionIndex = getAccordionIndexForSeason(season);

    const items = $(
      `body > div.wrap > div > div > div.browse > div > div.accordions > div.brw_accordion:nth-child(${accordionIndex}) > div.accordion_collapse > div.accordion_h`
    );

    items.each((index, item) => {
      const image =
        $(item).find('.ah_cover').attr('src')?.replace(/\s/g, '%20') || 'NA';
      const title = $(item).find('.ah_cover').attr('alt') || 'NA';
      const epLink = $(item).find('a').attr('href') || 'NA';
      const hLink =
        $(item).find('.acc_data > a:nth-child(1)').attr('href') || 'NA';
      const bgImgElm = $(item).find('.acc_bg_image').attr('style') || 'NA';
      const id = hLink?.split('/watch/')[1].replace('/', '');
      const match = bgImgElm.match(/url\('([^']+)'\)/);
      const bgImage = (match && match[1])?.replace(/\s/g, '%20');
      const dateRelease = $(item).find('.acc_info > span').text().trim();

      scrapedData.push({
        id,
        title,
        image,
        hLink,
        epLink,
        bgImage,
        dateRelease,
      });
    });

    if (scrapedData.length === 0) {
      return { m: 'No data found' };
    }

    return scrapedData;
  } catch (error) {
    console.error(error);
    throw createError(500, 'Internal Server Error');
  }
}

function getAccordionIndexForSeason(seasonInput) {
  const seasons = [
    'Winter 2023',
    'Autumn 2023',
    'Fall 2023',
    'Summer 2023',
    'Spring 2023',
  ];
  let bestMatchIndex = -1;
  let maxMatchCount = 0;

  for (let i = 0; i < seasons.length; i++) {
    const season = seasons[i];
    let matchCount = 0;

    for (let j = 0; j < Math.min(season.length, seasonInput.length); j++) {
      if (season[j].toLowerCase() === seasonInput[j].toLowerCase()) {
        matchCount++;
      } else {
        break;
      }
    }

    if (matchCount > maxMatchCount) {
      maxMatchCount = matchCount;
      bestMatchIndex = i;
    }
  }

  switch (bestMatchIndex) {
    case 0:
      return 1;
    case 1:
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return 4;
    default:
      return 1;
  }
}

module.exports = { getSeasons };
