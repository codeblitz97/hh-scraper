const { Router } = require('express');
const {
  search,
  info,
  recent,
  trendingMonth,
  tags,
  genres,
} = require('../controllers/hentai');

const router = Router();

router.get('/search', search);
router.get('/info', info);
router.get('/recent', recent);
router.get('/trending-month', trendingMonth);
router.get('/tags', tags);
router.get('/genres', genres);

module.exports = router;
