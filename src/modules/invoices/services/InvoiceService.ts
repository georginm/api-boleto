import { inject, injectable } from 'tsyringe';

import { BadRequestError } from '@shared/errors/BadRequestError';

import { IInvoiceDTO } from '../dto/IInvoiceDTO';
import { IConcessionaireUseCase } from '../useCases/concessionaireInvoiceUseCase/IConcessionaireUseCase';
import { ITitleUseCase } from '../useCases/titleInvoiceUseCase/ITitleUseCase';

@injectable()
class InvoiceService {
  constructor(
    @inject('TitleUseCase')
    private titleUseCases: ITitleUseCase,

    @inject('ConcessionaireUseCase')
    private concessionaireUseCase: IConcessionaireUseCase
  ) {}

  execute(digitableLine: string): IInvoiceDTO {
    if (digitableLine.length === 47) {
      return this.titleUseCases.handleTitleInvoice(digitableLine);
    }

    if (digitableLine.length === 48) {
      return this.concessionaireUseCase.handleConcessionaireInvoice(digitableLine);
    }

    throw new BadRequestError('O código digitado não é válido');
  }
}

export { InvoiceService };
