import { container } from 'tsyringe';

import { IConcessionaireUseCase } from '@modules/invoices/useCases/concessionaireInvoiceUseCase/IConcessionaireUseCase';
import { ConcessionaireUseCase } from '@modules/invoices/useCases/concessionaireInvoiceUseCase/implementation/ConcessionaireUseCase';
import { TitleUseCase } from '@modules/invoices/useCases/titleInvoiceUseCase/implementation/TitleUseCase';
import { ITitleUseCase } from '@modules/invoices/useCases/titleInvoiceUseCase/ITitleUseCase';

container.registerSingleton<ITitleUseCase>('TitleUseCase', TitleUseCase);

container.registerSingleton<IConcessionaireUseCase>(
  'ConcessionaireUseCase',
  ConcessionaireUseCase
);
