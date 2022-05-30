interface IFirstTitleField {
  if: string;
  currencyCode: string;
  freeField20x24: string;
  firstVerificationDigit: string;
}

interface ISecondTitleField {
  freeField25x34: string;
  secondVerificationDigit: string;
}

interface IThirdTitleField {
  freeField35x44: string;
  thirdVerificationDigit: string;
}

interface IFourthTitleField {
  barCodeVerificationDigit: string;
}

interface IFifthTitleField {
  expirationFactor: string;
  amount: string;
}

interface ITitleInvoiceFields {
  firstTitleField: IFirstTitleField;
  secondTitleField: ISecondTitleField;
  thirdTitleField: IThirdTitleField;
  fourthTitleField: IFourthTitleField;
  fifthTitleField: IFifthTitleField;
}

export {
  ITitleInvoiceFields,
  IFirstTitleField,
  ISecondTitleField,
  IThirdTitleField,
  IFourthTitleField,
  IFifthTitleField,
};
