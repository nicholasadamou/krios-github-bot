import express from 'express';

import dotenv from 'dotenv';

import updateAllDependents from './components/github-bot';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get('/health', (req, res) => res.sendStatus(200));
app.post('/', (req, res) => updateAllDependents(req, res));

app.listen(PORT);

console.log(`[Server] running on port ${PORT}.`);
