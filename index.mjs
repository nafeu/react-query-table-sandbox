import express from 'express';

const PORT = process.env.port || 8000;
const app = express();

const PROMPTS = [
  'Experiencing issues with', 'How to build with', 'How to use',
  'Need help integrating', 'Need help fixing',
]

const TOPICS = [
  'React Query & React Table', 'React Query',
  'React Table Global Filtering', 'React Table Sorting',
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
const FIFTEEN = 15;
const TWENTY = 20;
const FIFTY = 50;

let mockData = [];
let mockId = 0;

app.use(express.static('./build'));

app.listen(PORT, () => {
  console.log(`[ index.mjs ] Listening on port ${PORT}`)
});


const getUniqueId = () => ++mockId;
const randomItem = list => list[Math.floor((Math.random() * list.length))];
const randomIndex = list => Math.floor((Math.random() * list.length));
const randomInt = max => Math.floor(Math.random() * (Math.floor(max) - TWO)) + ONE;

const getInitialMockData = () => {
  const output = [];

  for (const count of Array(randomInt(TWENTY)).keys()) {
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

  if (output.length > FIFTEEN) {
    output.shift();
  }

  return output;
}

mockData = getInitialMockData();

app.get('/api', (req, res, next) => {
  mockData = updateData(mockData);
  res.json(mockData);
});
