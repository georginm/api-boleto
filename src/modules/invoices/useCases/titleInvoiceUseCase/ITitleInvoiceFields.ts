interface IFirstField {
  if: string;
  currencyCode: string;
  freeField20x24: string;
  firstVerificationDigit: string;
}

interface ISecondField {
  freeField25x34: string;
  secondVerificationDigit: string;
}

interface IThirdField {
  freeField35x44: string;
  thirdVerificationDigit: string;
}

interface IFourthField {
  barCodeVerificationDigit: string;
}

interface IFifthField {
  expirationFactor: string;
  amount: string;
}

interface ITitleInvoiceFields {
  firstField: IFirstField;
  secondField: ISecondField;
  thirdField: IThirdField;
  fourthField: IFourthField;
  fifthField: IFifthField;
}

export {
  ITitleInvoiceFields,
  IFirstField,
  ISecondField,
  IThirdField,
  IFourthField,
  IFifthField,
};
