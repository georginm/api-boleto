import express from 'express';
import 'express-async-errors';

import '../../../containers';
import handleErrors from './middleware/handleErrors';

const app = express();

app.use(express.json());

app.use(handleErrors);

export { app };
