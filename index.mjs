import express from 'express';

const PORT = process.env.port || 8000;

const app = express();

app.use(express.static('./build'));

app.listen(PORT, () => {
  console.log(`[ index.mjs ] Listening on port ${PORT}`)
});

app.get('/api', (req, res, next) => {
  res.status(200).send('OK');
});
