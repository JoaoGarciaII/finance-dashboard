from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), 'finance.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            amount REAL NOT NULL,
            date TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    # Seed data
    cursor = conn.execute('SELECT COUNT(*) FROM transactions')
    if cursor.fetchone()[0] == 0:
        seeds = [
            ('income', 'Salário', 'Salário mensal', 8500.00, '2026-04-01'),
            ('income', 'Freelance', 'Projeto React', 2200.00, '2026-04-05'),
            ('expense', 'Moradia', 'Aluguel', 1800.00, '2026-04-05'),
            ('expense', 'Alimentação', 'Mercado', 650.00, '2026-04-08'),
            ('expense', 'Transporte', 'Combustível', 280.00, '2026-04-10'),
            ('expense', 'Lazer', 'Streaming + Academia', 180.00, '2026-04-12'),
            ('income', 'Investimentos', 'Dividendos', 430.00, '2026-04-15'),
            ('expense', 'Saúde', 'Plano de saúde', 320.00, '2026-04-15'),
            ('expense', 'Educação', 'Curso online', 197.00, '2026-04-17'),
            ('expense', 'Alimentação', 'Restaurante', 95.00, '2026-04-17'),
        ]
        conn.executemany(
            'INSERT INTO transactions (type, category, description, amount, date) VALUES (?,?,?,?,?)',
            seeds
        )
    conn.commit()
    conn.close()

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')
    tx_type = request.args.get('type')

    conn = get_db()
    query = 'SELECT * FROM transactions WHERE 1=1'
    params = []
    if date_from:
        query += ' AND date >= ?'; params.append(date_from)
    if date_to:
        query += ' AND date <= ?'; params.append(date_to)
    if tx_type:
        query += ' AND type = ?'; params.append(tx_type)
    query += ' ORDER BY date DESC, id DESC'

    rows = conn.execute(query, params).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route('/api/transactions', methods=['POST'])
def create_transaction():
    data = request.get_json()
    required = ['type', 'category', 'description', 'amount', 'date']
    if not all(k in data for k in required):
        return jsonify({'error': 'Campos obrigatórios ausentes'}), 400
    if data['type'] not in ('income', 'expense'):
        return jsonify({'error': 'Tipo inválido'}), 400
    if data['amount'] <= 0:
        return jsonify({'error': 'Valor deve ser positivo'}), 400

    conn = get_db()
    cursor = conn.execute(
        'INSERT INTO transactions (type, category, description, amount, date) VALUES (?,?,?,?,?)',
        (data['type'], data['category'], data['description'], float(data['amount']), data['date'])
    )
    conn.commit()
    row = conn.execute('SELECT * FROM transactions WHERE id = ?', (cursor.lastrowid,)).fetchone()
    conn.close()
    return jsonify(dict(row)), 201

@app.route('/api/transactions/<int:tx_id>', methods=['PUT'])
def update_transaction(tx_id):
    data = request.get_json()
    conn = get_db()
    row = conn.execute('SELECT * FROM transactions WHERE id = ?', (tx_id,)).fetchone()
    if not row:
        conn.close()
        return jsonify({'error': 'Transação não encontrada'}), 404
    fields = {k: data.get(k, row[k]) for k in ['type','category','description','amount','date']}
    conn.execute(
        'UPDATE transactions SET type=?,category=?,description=?,amount=?,date=? WHERE id=?',
        (fields['type'], fields['category'], fields['description'], float(fields['amount']), fields['date'], tx_id)
    )
    conn.commit()
    updated = conn.execute('SELECT * FROM transactions WHERE id = ?', (tx_id,)).fetchone()
    conn.close()
    return jsonify(dict(updated))

@app.route('/api/transactions/<int:tx_id>', methods=['DELETE'])
def delete_transaction(tx_id):
    conn = get_db()
    row = conn.execute('SELECT * FROM transactions WHERE id = ?', (tx_id,)).fetchone()
    if not row:
        conn.close()
        return jsonify({'error': 'Transação não encontrada'}), 404
    conn.execute('DELETE FROM transactions WHERE id = ?', (tx_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Deletado com sucesso'})

@app.route('/api/summary', methods=['GET'])
def get_summary():
    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')
    conn = get_db()
    params = []
    where = 'WHERE 1=1'
    if date_from:
        where += ' AND date >= ?'; params.append(date_from)
    if date_to:
        where += ' AND date <= ?'; params.append(date_to)

    income = conn.execute(f'SELECT COALESCE(SUM(amount),0) FROM transactions {where} AND type="income"', params).fetchone()[0]
    expense = conn.execute(f'SELECT COALESCE(SUM(amount),0) FROM transactions {where} AND type="expense"', params).fetchone()[0]

    # Category breakdown
    cats = conn.execute(
        f'SELECT category, SUM(amount) as total FROM transactions {where} GROUP BY category ORDER BY total DESC',
        params
    ).fetchall()

    # Monthly trend (last 6 months)
    monthly = conn.execute('''
        SELECT strftime('%Y-%m', date) as month,
               SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
               SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
        FROM transactions
        GROUP BY month ORDER BY month DESC LIMIT 6
    ''').fetchall()

    conn.close()
    return jsonify({
        'income': income,
        'expense': expense,
        'balance': income - expense,
        'categories': [dict(r) for r in cats],
        'monthly': [dict(r) for r in reversed(monthly)]
    })

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
