import axios from 'axios';

import type { MovementType } from '@/constants/stock';
import type { Product } from '@/types/product';

import { api } from './api';
import { MovementRejectedError } from './errors';

/**
 * 🔌 BACKEND — ENDPOINTS E FORMATO DO JSON
 *
 * Tudo que liga o app à API Java está neste arquivo. Rotas do enunciado:
 *   GET   /api/produtos                    → listar
 *   GET   /api/produtos/{id}               → consultar
 *   PATCH /api/produtos/{id}/movimentacao  → { "tipo": "SAIDA", "quantidade": 3 }
 * Se o seu controller usar outro prefixo, ajuste `EXPO_PUBLIC_PRODUCTS_PATH` no `.env`.
 */
const BASE = `/${(process.env.EXPO_PUBLIC_PRODUCTS_PATH ?? '/api/produtos').replace(/^\/+|\/+$/g, '')}`;

const ENDPOINTS = {
  list: BASE,
  detail: (id: string) => `${BASE}/${id}`,
  movement: (id: string) => `${BASE}/${id}/movimentacao`,
};

/** Espelho do JSON devolvido pela API (campos do enunciado). */
interface ProductDto {
  id: number | string; // Long
  nome: string;
  descricao?: string | null;
  categoria?: string | null;
  quantidade: number;
  estoqueMinimo: number;
}

function mapProduct(dto: ProductDto): Product {
  return {
    id: String(dto.id),
    nome: dto.nome,
    descricao: dto.descricao?.trim() ? dto.descricao : null,
    categoria: dto.categoria?.trim() || 'Sem categoria',
    quantidade: Number(dto.quantidade ?? 0),
    estoqueMinimo: Number(dto.estoqueMinimo ?? 0),
  };
}

/** GET — aceita lista simples `[...]` ou página do Spring `{ content: [...] }`. */
export async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get<ProductDto[] | { content: ProductDto[] }>(ENDPOINTS.list);
  const list = Array.isArray(data) ? data : (data?.content ?? []);
  return list.map(mapProduct);
}

/** GET /{id} */
export async function fetchProduct(id: string): Promise<Product> {
  const { data } = await api.get<ProductDto>(ENDPOINTS.detail(id));
  return mapProduct(data);
}

/** Mensagens genéricas do Spring que não ajudam o usuário. */
const GENERIC = /^(bad request|conflict|unprocessable entity|validation failed|error)$/i;

function rejectionMessage(data: unknown): string | null {
  if (typeof data === 'string' && data.trim()) return data;
  if (data && typeof data === 'object') {
    for (const key of ['message', 'mensagem', 'erro', 'error', 'detail']) {
      const value = (data as Record<string, unknown>)[key];
      if (typeof value === 'string' && value.trim() && !GENERIC.test(value.trim())) return value;
    }
  }
  return null;
}

/**
 * PATCH /{id}/movimentacao  com { "tipo": "ENTRADA" | "SAIDA", "quantidade": n }
 * Devolve o produto com o NOVO saldo. Se a API responder 204 (sem corpo), o produto é buscado de novo.
 *
 * A validação "saída não pode deixar o estoque negativo" é da API (enunciado 2.4, passo 5):
 * o app envia o pedido e mostra o motivo da rejeição (HTTP 400/409/422).
 */
export async function registerMovement(
  id: string,
  tipo: MovementType,
  quantidade: number,
): Promise<Product> {
  try {
    const { data } = await api.patch<ProductDto | ''>(ENDPOINTS.movement(id), { tipo, quantidade });
    return data && typeof data === 'object' ? mapProduct(data) : fetchProduct(id);
  } catch (e) {
    const status = axios.isAxiosError(e) ? e.response?.status : undefined;
    if (status === 400 || status === 409 || status === 422) {
      const fallback =
        tipo === 'SAIDA'
          ? 'Estoque insuficiente: a saída é maior que o saldo disponível.'
          : 'A API recusou a movimentação. Confira a quantidade informada.';
      throw new MovementRejectedError(
        rejectionMessage(axios.isAxiosError(e) ? e.response?.data : null) ?? fallback,
      );
    }
    throw e;
  }
}
