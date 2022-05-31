import { IInvoiceDTO } from 'modules/invoices/dto/IInvoiceDTO';
import { moduleOf10, moduleOf11 } from 'modules/invoices/helpers/InvoiceHelpers';
import { BadRequestError } from 'shared/errors/BadRequestError';

import {
  IFifthField,
  IFirstField,
  IFourthField,
  ISecondField,
  IThirdField,
  ITitleFields,
} from '../ITitleFields';
import { ITitleUseCase } from '../ITitleUseCase';

class TitleUseCase implements ITitleUseCase {
  handleTitleInvoice(digitableLine: string): IInvoiceDTO {
    if (digitableLine[32] === '0') {
      throw new BadRequestError('O código digitado não é válido');
    }

    const { firstField, secondField, thirdField, fourthField, fifthField } =
      this.breakFields(digitableLine);

    this.barCodeVerificationDigit(digitableLine);

    this.verificationDigit(
      firstField.if + firstField.currencyCode + firstField.freeField20x24,
      firstField.firstVD
    );

    this.verificationDigit(secondField.freeField25x34, secondField.secondVD);
    this.verificationDigit(thirdField.freeField35x44, thirdField.thirdVD);

    const expirationDate = this.getExpirationDate(fifthField.expirationFactor);
    const barCode = this.constructBarCode(digitableLine);
    const amount = this.getAmount(fifthField.amount);

    return {
      amount,
      barCode,
      expirationDate,
    } as IInvoiceDTO;
  }

  private breakFields(digitableLine: string): ITitleFields {
    const firstField: IFirstField = {
      if: digitableLine.substring(0, 3),
      currencyCode: digitableLine[3],
      freeField20x24: digitableLine.substring(4, 9),
      firstVD: digitableLine[9],
    };

    const secondField: ISecondField = {
      freeField25x34: digitableLine.substring(10, 20),
      secondVD: digitableLine[20],
    };

    const thirdField: IThirdField = {
      freeField35x44: digitableLine.substring(21, 31),
      thirdVD: digitableLine[31],
    };

    const fourthField: IFourthField = {
      barCodeVD: digitableLine[32],
    };

    const fifthField: IFifthField = {
      expirationFactor: digitableLine.substring(33, 37),
      amount: digitableLine.substring(37, 47),
    };

    const invoiceFields = {
      firstField,
      secondField,
      thirdField,
      fourthField,
      fifthField,
    } as ITitleFields;

    return invoiceFields;
  }

  private barCodeVerificationDigit(digitableLine: string): void {
    const barCode = this.constructBarCode(digitableLine).split('').reverse();
    const vd = barCode.splice(-5, 1);
    const module = moduleOf11(barCode);

    if (module !== parseInt(vd[0], 10)) {
      throw new BadRequestError('O código digitado não é válido');
    }
  }

  private verificationDigit(field: string, vd: string): void {
    const digits = field.split('').reverse();
    const module = moduleOf10(digits);

    if (module !== parseInt(vd, 10)) {
      throw new BadRequestError('O código digitado não é válido');
    }
  }

  private moduleOf10OurNumber(field: string): string {
    const digits = field.split('').reverse();
    const multipliers = [2, 3, 4, 5, 6, 7, 8, 9];

    const multiplyAndSum = digits.reduce((sum, element, index) => {
      const multiplier = multipliers[index % multipliers.length];
      return sum + parseInt(element, 10) * multiplier;
    }, 0);

    const rest = multiplyAndSum % 11;

    if (rest === 10) return 'X';

    return `${rest}`;
  }

  private constructBarCode(digitableLine: string): string {
    const { fifthField, firstField, fourthField, secondField, thirdField } =
      this.breakFields(digitableLine);

    const barCode =
      firstField.if +
      firstField.currencyCode +
      fourthField.barCodeVD +
      fifthField.expirationFactor +
      fifthField.amount +
      firstField.freeField20x24 +
      secondField.freeField25x34 +
      thirdField.freeField35x44;

    return barCode;
  }

  private getExpirationDate(expirationFactor: string): string {
    if (parseInt(expirationFactor, 10) === 0)
      return 'O código de barras não tem data de vencimento';

    const date = new Date('1997-10-07');
    date.setDate(date.getDate() + parseInt(expirationFactor, 10));

    return date.toISOString().substring(0, 10);
  }

  private getAmount(digits: string): string {
    if (parseFloat(digits) === 0) return 'O código de barras não tem valor definido';
    return `${parseFloat(digits) / 100}`;
  }
}

export { TitleUseCase };
