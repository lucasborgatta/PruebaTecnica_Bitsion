export interface Persona {
  id: number;
  fullName: string;
  identification: string;
  age: number;
  gender: string;
  isActive: boolean;
  drives: boolean;
  usesGlasses: boolean;
  isDiabetic: boolean;
  otherDiseases?: string; 
}
