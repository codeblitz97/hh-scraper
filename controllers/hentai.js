const createError = require('http-errors');
const { getRecents } = require('../scrape/recent');
const { getInfo } = require('../scrape/info');
const { searchData } = require('../scrape/search');
const { getGenres } = require('../scrape/genres');
const { getTags } = require('../scrape/tags');
const { getTrendingMonth } = require('../scrape/trending');

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

const tags = async (req, res, next) => {
  try {
    const data = await getTags();
    res.send(data || 'No data');
  } catch (error) {
    next(createError(500, error.message));
  }
};

const trendingMonth = async (req, res, next) => {
  try {
    const data = await getTrendingMonth();
    res.json({ data });
  } catch (error) {
    next(createError(500, 'Internal Server Error'));
  }
};

module.exports = { recent, info, trendingMonth, tags, genres, search };
