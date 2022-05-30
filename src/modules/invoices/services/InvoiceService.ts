import { BadRequestError } from 'shared/errors/BadRequestError';
import { inject, injectable } from 'tsyringe';
import { isNumeric } from 'utils/numeric';

import { IInvoiceDTO } from '../dto/IInvoiceDTO';
import { ITitleInvoiceUseCase } from '../useCases/titleInvoiceUseCase/ITitleInvoiceUseCase';

@injectable()
class InvoiceService {
  constructor(
    @inject('TitleInvoiceUseCase')
    private titleInvoiceUseCases: ITitleInvoiceUseCase
  ) {}

  execute(digitableLine: string): IInvoiceDTO {
    if (!isNumeric(digitableLine))
      throw new BadRequestError('O código digitado não é válido');

    // if (digitableLine.length === 47)
    return this.titleInvoiceUseCases.handleTitleInvoice(digitableLine);

    // return this.handleConventionInvoice(digitableLine); // not implemented
  }
}

export { InvoiceService };
