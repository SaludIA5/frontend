export type User = {
  firstName: string;
  lastName: string;
  secondLastname?: string;
  rut: string;
  sex: string;
  isEligible: boolean;
  oxygenSaturation?: BigInteger;
};
