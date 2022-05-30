import express from 'express';
import 'express-async-errors';

import '../../../containers';
import { invoice } from 'modules/invoices/infra/express/routes/invoices.routes';

import handleErrors from './middleware/handleErrors';

const app = express();

app.use(express.json());

app.use(invoice);

app.use(handleErrors);

export { app };
