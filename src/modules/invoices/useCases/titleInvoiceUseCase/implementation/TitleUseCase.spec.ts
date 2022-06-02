import { TitleUseCase } from './TitleUseCase';

let titleUseCase: TitleUseCase;

describe('TitleUseCase', () => {
  beforeAll(() => {
    titleUseCase = new TitleUseCase();
  });

  it('should be return an ivoice', () => {
    const invoice = titleUseCase.handleTitleInvoice(
      '00190000090337049401911505307170588010000009049'
    );

    expect(invoice).toHaveProperty('amount');
    expect(invoice).toHaveProperty('barCode');
    expect(invoice).toHaveProperty('expirationDate');
  });

  it('should be return an ivoice', () => {
    const invoice = titleUseCase.handleTitleInvoice(
      '62390001170100009000901858508029700000000000000'
    );

    expect(invoice).toHaveProperty('amount');
    expect(invoice).toHaveProperty('barCode');
    expect(invoice).toHaveProperty('expirationDate');
    expect(invoice.amount).toBe('O código de barras não tem valor definido');
    expect(invoice.expirationDate).toBe('O código de barras não tem data de vencimento');
  });

  it('should not return an ivoice if a VD is equal to zero', () => {
    try {
      const VD = '0';
      titleUseCase.handleTitleInvoice(`00190000090337049401911505307170${VD}88010000009049`);
    } catch (error: any) {
      expect(error.message).toBe('O digito de verificação nao pode ser zero');
    }
  });

  it('should not return an ivoice if of barcode VD fails', () => {
    try {
      const barCodeVD = '9';
      titleUseCase.handleTitleInvoice(
        `00190000090337049401911505307170${barCodeVD}88010000009049`
      );
    } catch (error: any) {
      expect(error.message).toBe('Falha ao validar o DV do código de barras');
    }
  });

  it('should not return an ivoice if of barcode VD fails', () => {
    try {
      const VD1 = '3'; // 9

      titleUseCase.handleTitleInvoice(`001900000${VD1}0337049401911505307170588010000009049`);
    } catch (error: any) {
      expect(error.message).toBe('Falha ao validar um dos dígitos de verificação dos campos');
    }
  });

  it('should not return an invoice if it contains any letters', () => {
    try {
      const letter = 'a'; // 9

      titleUseCase.handleTitleInvoice(
        `001900000${letter}0337049401911505307170$588010000009049`
      );
    } catch (error: any) {
      expect(error.message).toBe('O código digitado só deve conter números');
    }
  });
});
