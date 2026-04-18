# Dashboard de Finanças Pessoais

Projeto full stack para portfólio com foco em front-end premium, consumo de API, organização de estado e visual moderno.

## Stack
- Frontend: React + Vite + Tailwind CSS + Chart.js + Framer Motion
- Backend: Flask + Flask-CORS
- Banco: SQLite

## Estrutura
```bash
finance-dashboard/
├── backend/
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── styles.css
│       ├── components/
│       ├── hooks/
│       └── utils/
└── README.md
```

## Como rodar o backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows
pip install -r requirements.txt
python app.py
```

Backend disponível em:
```bash
http://127.0.0.1:5000
```

## Como rodar o frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em:
```bash
http://localhost:5173
```

## Endpoints
### GET /api/transactions
Lista transações. Suporta:
- `date_from`
- `date_to`
- `type`

### POST /api/transactions
Cria transação.

Body exemplo:
```json
{
  "type": "expense",
  "category": "Moradia",
  "description": "Aluguel",
  "amount": 1800,
  "date": "2026-04-10"
}
```

### PUT /api/transactions/:id
Atualiza transação.

### DELETE /api/transactions/:id
Remove transação.

### GET /api/summary
Retorna:
- total de receitas
- total de despesas
- saldo
- categorias
- tendência mensal

## O que esse projeto mostra no portfólio
- Consumo de API REST com React
- Organização em componentes e hooks customizados
- CRUD completo
- Filtros por data
- Dashboard com gráficos
- UI premium dark com dourado/âmbar
- Microinterações e transições suaves

## Melhorias futuras
- autenticação
- metas financeiras
- exportar CSV
- dark/light toggle
- paginação e busca
- deploy com Render + Vercel
