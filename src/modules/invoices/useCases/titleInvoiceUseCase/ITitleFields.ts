interface IFirstField {
  if: string;
  currencyCode: string;
  freeField20x24: string;
  firstVD: string;
}

interface ISecondField {
  freeField25x34: string;
  secondVD: string;
}

interface IThirdField {
  freeField35x44: string;
  thirdVD: string;
}

interface IFourthField {
  barCodeVD: string;
}

interface IFifthField {
  expirationFactor: string;
  amount: string;
}

interface ITitleFields {
  firstField: IFirstField;
  secondField: ISecondField;
  thirdField: IThirdField;
  fourthField: IFourthField;
  fifthField: IFifthField;
}

export { ITitleFields, IFirstField, ISecondField, IThirdField, IFourthField, IFifthField };
