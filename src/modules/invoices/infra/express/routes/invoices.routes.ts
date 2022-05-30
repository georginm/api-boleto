import { Router } from 'express';

import { InvoiceController } from '../controllers/InvoiceController';

const invoice = Router();

const invoiceController = new InvoiceController();

invoice.get('/boleto/:digitableLine', invoiceController.handle);

export { invoice };
