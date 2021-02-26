import express from 'express';
import cors from 'cors';

const PORT = process.env.port || 8000;

const PROMPTS = [
  'Issues with', 'How to build with', 'How to use',
  'Trouble integrating', 'Need help fixing',
]

const TOPICS = [
  'React Query & React Table', 'React Query',
  'react-table global filters', 'react-table sorting',
  'React Table',
];

const USES = [
  'for a BI solution', 'for a stats aggregation platform',
  'for my leaderboard', 'in a reporting dashboard',
  'in my ecommerce app',
];

const ONE = 1;
const TWO = 2;
const THREE = 3;
const TWELVE = 12;
const TEN = 10;
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

  for (const count of Array(randomInt(TEN)).keys()) {
    output.push(
      {
        id: getUniqueId(),
        name: `${randomItem(PROMPTS)} ${randomItem(TOPICS)} ${randomItem(USES)}`,
        active: randomInt(FIFTY)
      }
    )
  }

  return output;
}

const updateData = data => {
  let output = [...data];

  for (const count of Array(randomInt(THREE)).keys()) {
    const item = randomItem(output);
    item.active = randomInt(FIFTY);

    output.push(
      {
        id: getUniqueId(),
        name: `${randomItem(PROMPTS)} ${randomItem(TOPICS)} ${randomItem(USES)}`,
        active: randomInt(FIFTY)
      }
    );
  }

  if (output.length > TWELVE) {
    output.shift();
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
