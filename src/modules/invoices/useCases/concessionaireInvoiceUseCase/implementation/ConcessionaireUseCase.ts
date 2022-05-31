import { IInvoiceDTO } from 'modules/invoices/dto/IInvoiceDTO';
import { moduleOf10, moduleOf11 } from 'modules/invoices/helpers/InvoiceHelpers';
import { BadRequestError } from 'shared/errors/BadRequestError';

import {
  IConcessionaireFields,
  IFirstField,
  IFourthField,
  ISecondField,
  IThirdField,
} from '../IConcessionaireFields';
import { IConcessionaireUseCase } from '../IConcessionaireUseCase';

class ConcessionaireUseCase implements IConcessionaireUseCase {
  handleConcessionaireInvoice(digitableLine: string): IInvoiceDTO {
    const { firstField, secondField, thirdField } = this.breakFields(digitableLine);

    if (firstField.product !== '8' || firstField.segment === '8') {
      throw new BadRequestError('O código digitado não é válido');
    }

    this.verificationDigit(digitableLine);

    this.barCodeVerificationDigit(digitableLine);

    let expirationDate: string;

    // company identified by CNPJ
    if (firstField.segment === '6') {
      expirationDate = this.getExpirationDate(thirdField.freeField23x33.substring(1, 9));
    } else {
      expirationDate = this.getExpirationDate(
        secondField.freeField20x22 + thirdField.freeField23x33.substring(0, 5)
      );
    }

    const amount = this.getAmount(firstField.amount5x11 + secondField.amount12x15);
    const barCode = this.constructBarCode(digitableLine);

    return {
      amount,
      barCode,
      expirationDate,
    } as IInvoiceDTO;
  }

  private breakFields(digitableLine: string): IConcessionaireFields {
    const firstField: IFirstField = {
      product: digitableLine[0],
      segment: digitableLine[1],
      realValue: digitableLine[2],
      generalVerifyingDigit: digitableLine[3],
      amount5x11: digitableLine.substring(4, 11),
      firstVD: digitableLine[11],
    };

    const secondField: ISecondField = {
      amount12x15: digitableLine.substring(12, 16),
      companyIdentifier16x19: digitableLine.substring(16, 20),
      freeField20x22: digitableLine.substring(20, 23),
      secondVD: digitableLine[23],
    };

    const thirdField: IThirdField = {
      freeField23x33: digitableLine.substring(24, 35),
      thirdVD: digitableLine[35],
    };

    const fourthField: IFourthField = {
      freeField34x44: digitableLine.substring(36, 47),
      fourthVD: digitableLine[47],
    };

    const concessionaire: IConcessionaireFields = {
      firstField,
      secondField,
      thirdField,
      fourthField,
    };

    return concessionaire;
  }

  private constructBarCode(digitableLine: string): string {
    return (
      digitableLine.substring(0, 11) +
      digitableLine.substring(12, 23) +
      digitableLine.substring(24, 35) +
      digitableLine.substring(36, 47)
    );
  }

  private barCodeVerificationDigit(digitableLine: string): void {
    const barCode = this.constructBarCode(digitableLine);
    const vdRemoved = barCode.substring(0, 3) + barCode.substring(4);

    const vd = digitableLine[3];

    if (digitableLine[3] === '6' || digitableLine[3] === '7') {
      this.verifyWithModuleOf10(vdRemoved, vd);
    } else if (digitableLine[3] === '8' || digitableLine[3] === '9') {
      this.verifyWithModuleOf11(vdRemoved, vd);
    } else {
      throw new BadRequestError('O código digitado não é válido');
    }
  }

  private verificationDigit(digitableLine: string): void {
    const { firstField, secondField, thirdField, fourthField } =
      this.breakFields(digitableLine);

    if (firstField.realValue === '6' || firstField.realValue === '7') {
      this.verifyWithModuleOf10(
        firstField.product +
          firstField.segment +
          firstField.realValue +
          firstField.generalVerifyingDigit +
          firstField.amount5x11,
        firstField.firstVD
      );

      this.verifyWithModuleOf10(
        secondField.amount12x15 +
          secondField.companyIdentifier16x19 +
          secondField.freeField20x22,
        secondField.secondVD
      );

      this.verifyWithModuleOf10(thirdField.freeField23x33, thirdField.thirdVD);
      this.verifyWithModuleOf10(fourthField.freeField34x44, fourthField.fourthVD);
    } else if (firstField.realValue === '8' || firstField.realValue === '9') {
      this.verifyWithModuleOf11(
        firstField.product +
          firstField.segment +
          firstField.realValue +
          firstField.generalVerifyingDigit +
          firstField.amount5x11,
        firstField.firstVD
      );

      this.verifyWithModuleOf11(
        secondField.amount12x15 +
          secondField.companyIdentifier16x19 +
          secondField.freeField20x22,
        secondField.secondVD
      );

      this.verifyWithModuleOf11(thirdField.freeField23x33, thirdField.thirdVD);
      this.verifyWithModuleOf11(fourthField.freeField34x44, fourthField.fourthVD);
    } else {
      throw new BadRequestError('O código digitado não é válido');
    }
  }

  private verifyWithModuleOf10(field: string, vd: string): void {
    const digits = field.split('').reverse();
    const module = moduleOf10(digits);

    if (`${module}` !== vd) {
      throw new BadRequestError('O código digitado não é válido');
    }
  }

  private verifyWithModuleOf11(field: string, vd: string): void {
    const digits = field.split('').reverse();
    const module = moduleOf11(digits);

    if (`${module}` !== vd) {
      throw new BadRequestError('O código digitado não é válido');
    }
  }

  private getAmount(amount: string): string {
    if (parseFloat(amount) === 0) {
      return 'O código de barras não tem valor definido';
    }

    return `${parseFloat(amount) / 100}`;
  }

  private getExpirationDate(fields: string): string {
    if (parseInt(fields, 10) === 0) return 'O código de barras não tem data de vencimento';

    // eslint-disable-next-line prettier/prettier
    const date = `${fields.substring(0, 4)}-${fields.substring(4, 6)}-${fields.substring(6,8)}`;

    try {
      new Date(date).toISOString();
    } catch (error) {
      return 'O código de barras não tem data de vencimento';
    }

    return date;
  }
}

export { ConcessionaireUseCase };
