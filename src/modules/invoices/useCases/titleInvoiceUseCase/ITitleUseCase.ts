import { IInvoiceDTO } from '../../dto/IInvoiceDTO';

interface ITitleUseCase {
  handleTitleInvoice(digitableLine: string): IInvoiceDTO;
}

export { ITitleUseCase };
