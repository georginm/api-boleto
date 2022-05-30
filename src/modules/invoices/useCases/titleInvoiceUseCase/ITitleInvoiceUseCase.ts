import { IInvoiceDTO } from '../../dto/IInvoiceDTO';

interface ITitleInvoiceUseCase {
  handleTitleInvoice(digitableLine: string): IInvoiceDTO;
}

export { ITitleInvoiceUseCase };
