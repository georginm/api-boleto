interface IFirstField {
  product: string;
  segment: string;
  realValue: string;
  generalVerifyingDigit: string;
  amount5x11: string;
  firstVD: string;
}

interface ISecondField {
  amount12x15: string;
  companyIdentifier16x19: string;
  freeField20x22: string;
  secondVD: string;
}

interface IThirdField {
  freeField23x33: string;
  thirdVD: string;
}

interface IFourthField {
  freeField34x44: string;
  fourthVD: string;
}

interface IConcessionaireFields {
  firstField: IFirstField;
  secondField: ISecondField;
  thirdField: IThirdField;
  fourthField: IFourthField;
}

export { IFirstField, ISecondField, IThirdField, IFourthField, IConcessionaireFields };
