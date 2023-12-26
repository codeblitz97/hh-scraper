const { Router } = require('express');
const {
  search,
  info,
  recent,
  tags,
  genres,
  uncensored,
  furry,
  yuri,
  softcore,
  random,
  seasons,
  trending,
  genreSearch,
  tagSearch,
  studio,
} = require('../controllers/hentai');

const router = Router();

router.get('/search', search);
router.get('/info', info);
router.get('/recent', recent);
router.get('/tags', tags);
router.get('/genres', genres);
router.get('/uncensored', uncensored);
router.get('/furry', furry);
router.get('/yuri', yuri);
router.get('/softcore', softcore);
router.get('/random', random);
router.get('/seasons', seasons);
router.get('/trending', trending);
router.get('/genre-search', genreSearch);
router.get('/tag-search', tagSearch);
router.get('/studio', studio);

module.exports = router;
