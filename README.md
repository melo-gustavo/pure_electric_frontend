# Pure Electric — Frontend

Interface em React (Vite) para consulta de produtos e pedidos, consumindo a API do
repositório `pure_electric_backend`.

## Pré-requisitos

- Node.js 20+
- [pnpm](https://pnpm.io/installation)

## Instalação

```bash
pnpm install
```

## Configuração

```bash
cp .env.example .env
```

| Variável      | Uso                                                                                                                  |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `VITE_API_URL` | Base da API usada pelo app em runtime. Local: `/api` (via proxy do Vite, abaixo). Produção: URL pública da API no Railway, sem barra final. |
| `BACKEND_URL`  | Só para o `dev`: para onde o proxy `/api` do Vite encaminha as chamadas. Padrão `http://localhost:8000` se não definida. |

## Rodando

```bash
pnpm dev       # http://localhost:5173, com proxy /api -> backend local
pnpm build     # build de produção em dist/
pnpm preview   # serve o build de dist/ localmente
```

## Testes e lint

```bash
pnpm test
pnpm lint
```

## Deploy

Publicado na Vercel (preset Vite). `VITE_API_URL` é lida no build, então trocar o
valor exige um novo deploy. Detalhes em `pure_electric_backend/README.md` (seção
"Deploy").
