import { IInvoiceDTO } from 'modules/invoices/dto/IInvoiceDTO';

interface IConcessionaireUseCase {
  handleConcessionaireInvoice(digitableLine: string): IInvoiceDTO;
}

export { IConcessionaireUseCase };
