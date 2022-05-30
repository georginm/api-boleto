import { IInvoiceDTO } from 'modules/invoices/dto/IInvoiceDTO';
import { BadRequestError } from 'shared/errors/BadRequestError';

import {
  IFifthTitleField,
  IFirstTitleField,
  IFourthTitleField,
  ISecondTitleField,
  IThirdTitleField,
  ITitleInvoiceFields,
} from '../ITitleInvoiceFields';
import { ITitleInvoiceUseCase } from '../ITitleInvoiceUseCase';

class TitleInvoiceUseCase implements ITitleInvoiceUseCase {
  handleTitleInvoice(digitableLine: string): IInvoiceDTO {
    if (parseInt(digitableLine[32], 10) === 0) {
      throw new BadRequestError('O código digitado não é válido');
    }

    const {
      firstTitleField,
      secondTitleField,
      thirdTitleField,
      fourthTitleField,
      fifthTitleField,
    } = this.breakFieldsDigitableLine(digitableLine);

    const barCodeDigit = this.verifyVerificationDigitBarcode(digitableLine);

    if (barCodeDigit !== parseInt(fourthTitleField.barCodeVerificationDigit, 10)) {
      throw new BadRequestError('O código digitado não é válido');
    }

    const firstVerificationDigit = this.verifyVerificationDigit(
      firstTitleField.if + firstTitleField.currencyCode + firstTitleField.freeField20x24
    );

    if (firstVerificationDigit !== parseInt(firstTitleField.firstVerificationDigit, 10)) {
      throw new BadRequestError('O código digitado não é válido');
    }

    const secondVerificationDigit = this.verifyVerificationDigit(
      secondTitleField.freeField25x34
    );

    if (
      secondVerificationDigit !== parseInt(secondTitleField.secondVerificationDigit, 10)
    ) {
      throw new BadRequestError('O código digitado não é válido');
    }

    const thirdVerificationDigit = this.verifyVerificationDigit(
      thirdTitleField.freeField35x44
    );

    if (thirdVerificationDigit !== parseInt(thirdTitleField.thirdVerificationDigit, 10)) {
      throw new BadRequestError('O código digitado não é válido');
    }

    const expirationDate = this.getExpirationDate(fifthTitleField.expirationFactor);
    const barCode = this.constructBarCode(digitableLine);
    const amount = this.getAmount(fifthTitleField.amount);

    return {
      amount,
      barCode,
      expirationDate,
    } as IInvoiceDTO;
  }

  private breakFieldsDigitableLine(digitableLine: string): ITitleInvoiceFields {
    const firstTitleField: IFirstTitleField = {
      if: digitableLine.substring(0, 3),
      currencyCode: digitableLine[3],
      freeField20x24: digitableLine.substring(4, 9),
      firstVerificationDigit: digitableLine[9],
    };

    const secondTitleField: ISecondTitleField = {
      freeField25x34: digitableLine.substring(10, 20),
      secondVerificationDigit: digitableLine[20],
    };

    const thirdTitleField: IThirdTitleField = {
      freeField35x44: digitableLine.substring(21, 31),
      thirdVerificationDigit: digitableLine[31],
    };

    const fourthTitleField: IFourthTitleField = {
      barCodeVerificationDigit: digitableLine[32],
    };

    const fifthTitleField: IFifthTitleField = {
      expirationFactor: digitableLine.substring(33, 37),
      amount: digitableLine.substring(37, 47),
    };

    const invoiceFields = {
      firstTitleField,
      secondTitleField,
      thirdTitleField,
      fourthTitleField,
      fifthTitleField,
    } as ITitleInvoiceFields;

    return invoiceFields;
  }

  private verifyVerificationDigit(field: string): number {
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

  private verifyVerificationDigitBarcode(digitableLine: string): number {
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
    const {
      fifthTitleField,
      firstTitleField,
      fourthTitleField,
      secondTitleField,
      thirdTitleField,
    } = this.breakFieldsDigitableLine(digitableLine);

    const barCode = firstTitleField.if
      .concat(firstTitleField.currencyCode)
      .concat(fourthTitleField.barCodeVerificationDigit)
      .concat(fifthTitleField.expirationFactor)
      .concat(fifthTitleField.amount)
      .concat(firstTitleField.freeField20x24)
      .concat(secondTitleField.freeField25x34)
      .concat(thirdTitleField.freeField35x44);

    return barCode;
  }

  private getExpirationDate(expirationFactor: string): string {
    if (parseInt(expirationFactor, 10) === 0) return 'Barcode has no expiration date';

    const date = new Date('1997-10-07');

    date.setDate(date.getDate() + parseInt(expirationFactor, 10));

    return date.toISOString().substring(0, 10);
  }

  private getAmount(digits: string): string {
    if (parseFloat(digits) === 0) return 'Barcode has no amount';
    return `${parseFloat(digits) / 100}`;
  }
}

export { TitleInvoiceUseCase };
