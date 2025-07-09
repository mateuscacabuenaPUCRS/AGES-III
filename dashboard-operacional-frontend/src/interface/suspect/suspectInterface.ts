export interface suspectInterface {
  nome: string | null;
  apelido: string | null;
  cpf: string | null;
  relevante: boolean | null;
  anotacoes: string | null;
}

export interface suspectResponseInterface {
  id: number | null;
  nome: string | null;
  cpf: string | null;
  apelido: string | null;
  anotacoes: string | null;
  relevante: boolean | null;
  lastUpdateDate: string | null;
  lastUpdateCpf: string | null;
}
