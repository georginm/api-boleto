import { IInvoiceDTO } from 'modules/invoices/dto/IInvoiceDTO';
import { BadRequestError } from 'shared/errors/BadRequestError';

import {
  IFifthField,
  IFirstField,
  IFourthField,
  ISecondField,
  IThirdField,
  ITitleInvoiceFields,
} from '../ITitleInvoiceFields';
import { ITitleInvoiceUseCase } from '../ITitleInvoiceUseCase';

class TitleInvoiceUseCase implements ITitleInvoiceUseCase {
  handleTitleInvoice(digitableLine: string): IInvoiceDTO {
    if (parseInt(digitableLine[32], 10) === 0) {
      throw new BadRequestError('O código digitado não é válido');
    }

    const { firstField, secondField, thirdField, fourthField, fifthField } =
      this.breakFields(digitableLine);

    const barCodeDigit = this.verificationDigitBarcode(digitableLine);
    if (barCodeDigit !== parseInt(fourthField.barCodeVerificationDigit, 10)) {
      throw new BadRequestError('O código digitado não é válido');
    }

    const firstVerificationDigit = this.verificationDigit(
      firstField.if + firstField.currencyCode + firstField.freeField20x24
    );
    if (firstVerificationDigit !== parseInt(firstField.firstVerificationDigit, 10)) {
      throw new BadRequestError('O código digitado não é válido');
    }

    const secondVerificationDigit = this.verificationDigit(secondField.freeField25x34);
    if (secondVerificationDigit !== parseInt(secondField.secondVerificationDigit, 10)) {
      throw new BadRequestError('O código digitado não é válido');
    }

    const thirdVerificationDigit = this.verificationDigit(thirdField.freeField35x44);
    if (thirdVerificationDigit !== parseInt(thirdField.thirdVerificationDigit, 10)) {
      throw new BadRequestError('O código digitado não é válido');
    }

    const expirationDate = this.getExpirationDate(fifthField.expirationFactor);
    const barCode = this.constructBarCode(digitableLine);
    const amount = this.getAmount(fifthField.amount);

    return {
      amount,
      barCode,
      expirationDate,
    } as IInvoiceDTO;
  }

  private breakFields(digitableLine: string): ITitleInvoiceFields {
    const firstField: IFirstField = {
      if: digitableLine.substring(0, 3),
      currencyCode: digitableLine[3],
      freeField20x24: digitableLine.substring(4, 9),
      firstVerificationDigit: digitableLine[9],
    };

    const secondField: ISecondField = {
      freeField25x34: digitableLine.substring(10, 20),
      secondVerificationDigit: digitableLine[20],
    };

    const thirdField: IThirdField = {
      freeField35x44: digitableLine.substring(21, 31),
      thirdVerificationDigit: digitableLine[31],
    };

    const fourthField: IFourthField = {
      barCodeVerificationDigit: digitableLine[32],
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
    } as ITitleInvoiceFields;

    return invoiceFields;
  }

  private verificationDigit(field: string): number {
    const digits = field.split('').reverse();

    const sumDigits = digits.reduce((sum, element, index) => {
      const multiplier = index % 2 === 0 ? 2 : 1;
      const result = multiplier * parseInt(element, 10);

      return result
        .toString()
        .split('')
        .reduce((newSum, element) => newSum + parseInt(element, 10), sum);
    }, 0);

    const verificationDigit = Math.abs((sumDigits % 10) - 10);

    return verificationDigit === 10 ? 0 : verificationDigit;
  }

  private verificationDigitBarcode(digitableLine: string): number {
    const multipliers = [2, 3, 4, 5, 6, 7, 8, 9];

    const barCode = this.constructBarCode(digitableLine).split('').reverse();

    barCode.splice(-5, 1);

    const multiplyAndSum = barCode.reduce((sum, element, index) => {
      const multiplier = multipliers[index % multipliers.length];
      return sum + parseInt(element, 10) * multiplier;
    }, 0);

    const rest = multiplyAndSum % 11;

    const result = 11 - rest;

    if (result === 0 || result === 10 || result === 11) return 1;

    return result;
  }

  private constructBarCode(digitableLine: string): string {
    const { fifthField, firstField, fourthField, secondField, thirdField } =
      this.breakFields(digitableLine);

    const barCode =
      firstField.if +
      firstField.currencyCode +
      fourthField.barCodeVerificationDigit +
      fifthField.expirationFactor +
      fifthField.amount +
      firstField.freeField20x24 +
      secondField.freeField25x34 +
      thirdField.freeField35x44;

    return barCode;
  }

  private getExpirationDate(expirationFactor: string): string {
    if (parseInt(expirationFactor, 10) === 0) return 'Code has no expiration date';

    const date = new Date('1997-10-07');

    date.setDate(date.getDate() + parseInt(expirationFactor, 10));

    return date.toISOString().substring(0, 10);
  }

  private getAmount(digits: string): string {
    if (parseFloat(digits) === 0) return 'Code has no amount';
    return `${parseFloat(digits) / 100}`;
  }
}

export { TitleInvoiceUseCase };
