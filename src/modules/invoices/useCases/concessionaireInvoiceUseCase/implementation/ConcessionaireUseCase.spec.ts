import { ConcessionaireUseCase } from './ConcessionaireUseCase';

let concessionaireInvoice: ConcessionaireUseCase;

describe('ConcessionaireUseCase', () => {
  beforeAll(() => {
    concessionaireInvoice = new ConcessionaireUseCase();
  });

  it('should be return an ivoice', () => {
    const invoice = concessionaireInvoice.handleConcessionaireInvoice(
      '826600000002250310282026007150250111400131062012'
    );

    expect(invoice).toHaveProperty('amount');
    expect(invoice).toHaveProperty('barCode');
    expect(invoice).toHaveProperty('expirationDate');

    expect(invoice.amount).toBe('25.03');
    expect(invoice.barCode).toBe('82660000000250310282020071502501140013106201');
    expect(invoice.expirationDate).toBe('2020-07-15');
  });

  it('should be return an ivoice', () => {
    const invoice = concessionaireInvoice.handleConcessionaireInvoice(
      '838800000003837100384072013708848208014124939732'
    );

    expect(invoice).toHaveProperty('amount');
    expect(invoice).toHaveProperty('barCode');
    expect(invoice).toHaveProperty('expirationDate');
    expect(invoice.expirationDate).toBe('O código de barras não tem data de vencimento');
  });

  it('should not return an invoice if it contains any letters', () => {
    try {
      const letter = 'a'; // 8

      concessionaireInvoice.handleConcessionaireInvoice(
        `83880000000383710038407201370884${letter}208014124939732`
      );
    } catch (error: any) {
      expect(error.message).toBe('O código digitado só deve conter números');
    }
  });

  it('should not return an invoice if the product code is invalid', () => {
    try {
      const invalidProduct = '0';
      concessionaireInvoice.handleConcessionaireInvoice(
        `${invalidProduct}38800000003837100384072013708848208014124939732`
      );
    } catch (error: any) {
      expect(error.message).toBe('O código do produto informado é inválido');
    }
  });

  it('should not return an invoice if the segment code is invalid', () => {
    try {
      const segmentInvalid = '8'; // 3
      concessionaireInvoice.handleConcessionaireInvoice(
        `8${segmentInvalid}8800000003837100384072013708848208014124939732`
      );
    } catch (error: any) {
      expect(error.message).toBe('O código de segmento informado é inválido');
    }
  });

  it('should not return an invoice if the real value is invalid', () => {
    try {
      const realValue = '3'; // 8
      concessionaireInvoice.handleConcessionaireInvoice(
        `83${realValue}800000003837100384072013708848208014124939732`
      );
    } catch (error: any) {
      expect(error.message).toBe('Falha ao validar digito do valor efetivo/referência');
    }
  });

  it('should not return an invoice if any of the verification digits are invalid', () => {
    try {
      const invalidVD = '3'; // 8
      concessionaireInvoice.handleConcessionaireInvoice(
        `83880000000383710038407201370884820801412493973${invalidVD}`
      );
    } catch (error: any) {
      expect(error.message).toBe('Falha ao validar o digito de verificação de um dos campos');
    }
  });

  it('should not return an invoice if of barcode VD fails', () => {
    try {
      const barCodeVD = '9';
      concessionaireInvoice.verifyWithModuleOf11(
        `838${barCodeVD}0000000837100384070137088482001412493973`,
        '8'
      );
    } catch (error: any) {
      expect(error.message).toBe('Falha ao validar o DV do código de barras');
    }
  });

  it('should not return an invoice if of VD fails', () => {
    try {
      const VD = '9';
      concessionaireInvoice.verifyWithModuleOf11(`01412493973`, '2');
    } catch (error: any) {
      expect(error.message).toBe('Falha ao validar o digito de verificação de um dos campos');
    }
  });

  it('should not return an invoice if of barcode VD fails', () => {
    try {
      const barCodeVD = '9';
      concessionaireInvoice.verifyWithModuleOf10(
        `838${barCodeVD}0000000837100384070137088482001412493973`,
        '8'
      );
    } catch (error: any) {
      expect(error.message).toBe('Falha ao validar o DV do código de barras');
    }
  });

  it('should not return an invoice if of VD fails', () => {
    try {
      concessionaireInvoice.verifyWithModuleOf10(`01412493973`, '2');
    } catch (error: any) {
      expect(error.message).toBe('Falha ao validar o digito de verificação de um dos campos');
    }
  });

  it('should be return a expiration date', () => {
    expect(concessionaireInvoice.getExpirationDate('20000703')).toBe('2000-07-03');
    expect(concessionaireInvoice.getExpirationDate('20200229')).toBe('2020-02-29');
    expect(concessionaireInvoice.getExpirationDate('99999999')).toBe(
      'O código de barras não tem data de vencimento'
    );
    expect(concessionaireInvoice.getExpirationDate('00000000')).toBe(
      'O código de barras não tem data de vencimento'
    );
    expect(concessionaireInvoice.getExpirationDate('20210229')).toBe(
      'O código de barras não tem data de vencimento'
    );
  });

  it('should return that the invoice has no amount', () => {
    expect(concessionaireInvoice.getAmount('00000000000')).toBe(
      'O código de barras não tem valor definido'
    );
  });
});
