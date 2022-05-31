import { TitleUseCase } from 'modules/invoices/useCases/titleInvoiceUseCase/Implementation/TitleUseCase';
import { ITitleUseCase } from 'modules/invoices/useCases/titleInvoiceUseCase/ITitleUseCase';
import { container } from 'tsyringe';

container.registerSingleton<ITitleUseCase>('TitleUseCase', TitleUseCase);
