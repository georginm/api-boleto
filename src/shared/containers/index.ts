import { TitleInvoiceUseCase } from 'modules/invoices/useCases/titleInvoiceUseCase/Implementation/TitleInvoiceUseCase';
import { ITitleInvoiceUseCase } from 'modules/invoices/useCases/titleInvoiceUseCase/ITitleInvoiceUseCase';
import { container } from 'tsyringe';

container.registerSingleton<ITitleInvoiceUseCase>(
  'TitleInvoiceUseCase',
  TitleInvoiceUseCase
);
