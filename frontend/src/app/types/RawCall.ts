// Define el tipo para los datos crudos de la API

export interface RawCall {
  id_call: number;
  user?: {
    name: string;
    role: string;
  };
  date: string;
  duration: number;
  transcript?: {
    text: string;
  };
  report?: {
    summary: string;
  };
}


