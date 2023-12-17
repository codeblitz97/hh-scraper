const createError = require('http-errors');
const { getRecents } = require('../scrape/recent');
const { getInfo } = require('../scrape/info');
const { searchData } = require('../scrape/search');
const { getGenres } = require('../scrape/genres');
const { getTags } = require('../scrape/tags');
const { getTrending } = require('../scrape/trending');
const { getUncensored } = require('../scrape/ucens');
const { getFurry } = require('../scrape/furry');
const { getYuri } = require('../scrape/yuri');
const { getSoftcore } = require('../scrape/softcore');
const { getRandom } = require('../scrape/random');
const { getSeasons } = require('../scrape/seasons');
const { getGenresSearch } = require('../scrape/genresSeries');
const { getTagsSearch } = require('../scrape/tagSeries');

const recent = async (req, res, next) => {
  try {
    let { page } = req.query || 1;
    let { limit } = req.query || 7;

    const data = await getRecents(page, limit);
    res.json({ data });
  } catch (error) {
    next(createError(500, error.message));
  }
};

const random = async (req, res, next) => {
  try {
    let { page } = req.query || 1;
    let { limit } = req.query || 7;

    const data = await getRandom(page, limit);
    res.json({ data });
  } catch (error) {
    next(createError(500, error.message));
  }
};

const info = async (req, res, next) => {
  try {
    const { id } = req.query;
    if (!id) {
      throw createError(400, 'Id is required.');
    }
    const data = await getInfo(id);
    res.json({ data });
  } catch (error) {
    next(createError(500, error.message));
  }
};

const search = async (req, res, next) => {
  try {
    const page = req.query.page;
    const query = req.query.q;
    const data = await searchData(page, query);
    res.send(data || 'No data');
  } catch (error) {
    next(createError(500, error.message));
  }
};

const genres = async (req, res, next) => {
  try {
    const data = await getGenres();
    res.send(data || 'No data');
  } catch (error) {
    next(createError(500, error.message));
  }
};

const uncensored = async (req, res, next) => {
  try {
    const { page } = req.query || 1;
    const { limit } = req.query || 10;

    const data = await getUncensored(page, limit);
    res.send(data || 'No data');
  } catch (error) {
    next(createError(500, error.message));
  }
};

const furry = async (req, res, next) => {
  try {
    const { page } = req.query || 1;
    const { limit } = req.query || 10;

    const data = await getFurry(page, limit);
    res.send(data || 'No data');
  } catch (error) {
    next(createError(500, error.message));
  }
};

const yuri = async (req, res, next) => {
  try {
    const { page } = req.query || 1;
    const { limit } = req.query || 10;

    const data = await getYuri(page, limit);
    res.send(data || 'No data');
  } catch (error) {
    next(createError(500, error.message));
  }
};

const softcore = async (req, res, next) => {
  try {
    const { page } = req.query || 1;
    const { limit } = req.query || 10;

    const data = await getSoftcore(page, limit);
    res.send(data || 'No data');
  } catch (error) {
    next(createError(500, error.message));
  }
};

const tags = async (req, res, next) => {
  try {
    const data = await getTags();
    res.send(data || 'No data');
  } catch (error) {
    next(createError(500, error.message));
  }
};

const seasons = async (req, res, next) => {
  try {
    const { season } = req.query;
    const data = await getSeasons(season);
    res.json({ data });
  } catch (error) {
    next(createError(500, 'Internal Server Error'));
  }
};

const trending = async (req, res, next) => {
  try {
    const { type, page, limit } = req.query;
    const data = await getTrending(page, limit, type);
    res.json({ data });
  } catch (error) {
    next(createError(500, error.message));
  }
};

const genreSearch = async (req, res, next) => {
  try {
    const { genre, page, limit } = req.query;
    const data = await getGenresSearch(page, limit, genre);
    res.json({ data });
  } catch (error) {
    next(createError(500, error.message));
  }
};

const tagSearch = async (req, res, next) => {
  try {
    const { tag, page, limit } = req.query;
    const data = await getTagsSearch(page, limit, tag);
    res.json({ data });
  } catch (error) {
    next(createError(500, error.message));
  }
};

module.exports = {
  recent,
  info,
  tags,
  genres,
  search,
  uncensored,
  furry,
  yuri,
  softcore,
  random,
  seasons,
  trending,
  genreSearch,
  tagSearch,
};
