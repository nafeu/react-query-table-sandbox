import express from 'express';
import cors from 'cors';

const PORT = process.env.port || 8000;

const PROMPTS = [
  'Issues with', 'How to build with', 'How to use',
  'Trouble integrating', 'Need help fixing',
]

const TOPICS = [
  'react-query', 'react-table', 'global filters',
  'table sorting', 'expanding rows',
];

const USES = [
  'for BI solution', 'for stats aggregation',
  'for leaderboard', 'in reporting dashboard',
  'in ecommerce app',
];

const STATUSES = ['open', 'resolved', 'locked']

const ONE = 1;
const TWO = 2;
const THREE = 3;
const TWELVE = 12;
const TEN = 10;
const TWENTY = 20;
const FIFTY = 50;
const ONE_SECOND = 1000;

let mockData = [];
let mockId = 0;

const app = express();
app.use(express.static('./build'));
app.use(cors());

app.listen(PORT, () => {
  console.log(`[ index.mjs ] Listening on port ${PORT}`)
});


const getUniqueId = () => ++mockId;
const randomItem = list => list[Math.floor((Math.random() * list.length))];
const randomIndex = list => Math.floor((Math.random() * list.length));
const randomInt = max => Math.floor(Math.random() * (Math.floor(max) - TWO)) + ONE;

const getInitialMockData = () => {
  const output = [];

  for (const count of Array(TEN).keys()) {
    output.push(
      {
        id: getUniqueId(),
        name: `${randomItem(PROMPTS)} ${randomItem(TOPICS)} ${randomItem(USES)}`,
        active: randomInt(FIFTY),
        status: randomItem(STATUSES),
        upvotes: randomInt(FIFTY)
      }
    )
  }

  return output;
}

const updateData = data => {
  let output = [...data];

  for (const count of Array(randomInt(THREE)).keys()) {
    randomItem(output).active = randomInt(FIFTY);
    randomItem(output).status = randomItem(STATUSES);
    randomItem(output).upvotes += randomInt(TEN);
  }

  return output;
}

const generateRows = amount => {
  const output = [];

  for (const count of Array(randomInt(amount)).keys()) {
    output.push(
      {
        id: getUniqueId(),
        name: `${randomItem(PROMPTS)} ${randomItem(TOPICS)} ${randomItem(USES)}`,
        active: randomInt(FIFTY),
        status: randomItem(STATUSES),
        upvotes: randomInt(FIFTY)
      }
    )
  }

  return output;
}

mockData = getInitialMockData();

app.get('/api', (req, res, next) => {
  setTimeout(() => {
    mockData = updateData(mockData);
    res.json(mockData);
  }, ONE_SECOND);
});

app.get('/api/child', (req, res, next) => {
  setTimeout(() => {
    res.json(generateRows(THREE));
  }, ONE_SECOND);
});
