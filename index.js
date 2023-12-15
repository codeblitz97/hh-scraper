const express = require('express');
const cors = require('cors');
const { getRecents } = require('./scrape/recent');
const { getInfo } = require('./scrape/info');
const { getStreamLink } = require('./scrape/streamlink');
const { searchData } = require('./scrape/search');

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'HentaiTown API!',
  });
});

app.get('/recent', async (req, res) => {
  let { page } = req.query || 1;

  const data = await getRecents(page);

  res.json({ data: data });
});

app.get('/info', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      data: {
        message: 'Id is required.',
      },
    });
  }

  const data = await getInfo(id);

  res.json({ data: data });
});

app.get('/search', async (req, res) => {
  const page = req.query.page;
  const query = req.query.q;

  const data = await searchData(page, query);

  res.send(data || 'No data');
});

app.get('/stream/:id/:epId', async (req, res) => {
  const id = req.params.id;
  const epId = req.params.epId;

  const watchId = `${id}/${epId}`;

  if (!id) {
    return res.status(400).json({
      data: {
        message: 'Id is required.',
      },
    });
  }

  console.log(watchId);

  const data = await getStreamLink(watchId);

  res.json({ data: data });
});

app.listen(3000, () => {
  console.log('Hentai Oni-chan!');
});
