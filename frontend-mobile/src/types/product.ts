/**
 * Entidade `Produto` do enunciado. A tradução do JSON da API para este formato é feita em `services/products.ts`.
 *
 * | campo         | tipo    | regra                         |
 * |---------------|---------|-------------------------------|
 * | id            | Long    | gerado automaticamente        |
 * | nome          | String  | obrigatório                   |
 * | descricao     | String  | opcional                      |
 * | categoria     | String  | obrigatório                   |
 * | quantidade    | Integer | obrigatório, maior ou igual a 0 |
 * | estoqueMinimo | Integer | obrigatório, maior ou igual a 0 |
 */
export interface Product {
  id: string;
  nome: string;
  descricao: string | null;
  categoria: string;
  quantidade: number;
  estoqueMinimo: number;
}
