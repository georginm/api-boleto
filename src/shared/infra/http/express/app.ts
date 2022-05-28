import express from 'express';

import 'express-async-errors';
import 'dotenv/config';

const app = express();

app.use(express.json());

export { app };
