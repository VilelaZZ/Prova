# StockFlow (mobile)

App Expo (React Native + expo-router) do StockFlow: lista os produtos, mostra saldo e estoque mínimo,
destaca **estoque baixo** e registra **entrada/saída** consumindo a API Java (Spring Boot) via Axios.

## Rodando

```bash
npm install
cp .env.example .env      # ajuste EXPO_PUBLIC_API_URL (veja abaixo)
npx expo start -c
```

## URL da API (celular físico)

| Onde o app roda            | `EXPO_PUBLIC_API_URL`                          |
| -------------------------- | ---------------------------------------------- |
| Emulador Android           | `http://10.0.2.2:8080`                         |
| Simulador iOS / Web        | `http://localhost:8080`                        |
| Celular físico (Expo Go)   | `http://<IP-DO-PC>:8080` (ex.: `192.168.0.15`) |

O celular e o computador precisam estar na mesma rede Wi-Fi e o backend deve escutar em `0.0.0.0`
(`server.address=0.0.0.0` no `application.properties`) com CORS liberado. Descubra o IP com
`ipconfig` (Windows) ou `ifconfig` (Linux/macOS). Depois de mudar o `.env`: `npx expo start -c`.

## Telas e navegação

| Rota             | Arquivo                      | O que faz                                                              |
| ---------------- | ---------------------------- | ---------------------------------------------------------------------- |
| `/`              | `src/app/index.tsx`          | Lista de produtos, resumo, filtros (todos / estoque baixo / categoria) |
| `/products/[id]` | `src/app/products/[id].tsx`  | Tabela com os dados essenciais do produto e registro de entrada/saída |

A lista recarrega ao voltar dos detalhes (`useFocusEffect`) e ao puxar para atualizar.

## Contrato com a API

| Ação        | Requisição                                                        | Resposta                              |
| ----------- | ----------------------------------------------------------------- | ------------------------------------- |
| Listar      | `GET /api/produtos`                                               | `[Produto]` (ou página `{content:[]}`) |
| Consultar   | `GET /api/produtos/{id}`                                          | `Produto`                             |
| Movimentar  | `PATCH /api/produtos/{id}/movimentacao` `{ "tipo": "SAIDA", "quantidade": 3 }` | `Produto` com o novo saldo (ou `204`) |

`Produto`: `id`, `nome`, `descricao`, `categoria`, `quantidade`, `estoqueMinimo`.

Regras: o app só envia quantidade inteira positiva. A regra **"saída não pode deixar o estoque
negativo"** é da API: ela responde `400` (também tratados `409`/`422`) e o app mostra o motivo no
formulário, sem alterar o saldo exibido. **Estoque baixo** = `quantidade <= estoqueMinimo`.

Para ajustar rotas ou campos: `src/services/products.ts` (procure por `🔌 BACKEND`) e, se o prefixo
mudar, `EXPO_PUBLIC_PRODUCTS_PATH` no `.env`.

## Roteiro da demonstração (enunciado 2.4)

1. No Angular, cadastre "Caderno" (quantidade 10, estoque mínimo 3).
2. No Expo, atualize a lista e abra "Caderno".
3. Registre uma **saída de 8** → saldo 2 e selo **Estoque baixo**.
4. Atualize o Angular: saldo 2 e indicação de estoque baixo.
5. No Expo, tente uma **saída de 3** → a API rejeita e o app exibe "Estoque insuficiente".
