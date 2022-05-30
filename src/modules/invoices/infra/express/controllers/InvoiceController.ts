import { Request, Response } from 'express';
import { InvoiceService } from 'modules/invoices/services/InvoiceService';
import { container } from 'tsyringe';

class InvoiceController {
  handle(request: Request, response: Response): Response {
    const { digitableLine } = request.params;

    const invoiceService = container.resolve(InvoiceService);

    const invoice = invoiceService.execute(digitableLine);

    return response.json(invoice);
  }
}

export { InvoiceController };
