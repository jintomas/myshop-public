import sqlite3
import os
import json
from utils import get_root_dir

ROOT_DIR = get_root_dir()
DATABASE_DIR = os.path.join(ROOT_DIR, 'database')
DATABASE_FILE = os.path.join(DATABASE_DIR, 'prathamubs.db')


def connect():
    conn = sqlite3.connect(database=DATABASE_FILE)
    if not os.path.exists(DATABASE_FILE):
        _init(conn)
    return conn


def _init(conn: sqlite3.Connection):
    # Create table
    conn.execute('''CREATE TABLE stocks
                 (date text, trans text, symbol text, qty real, price real)''')

    # Insert a row of data
    conn.execute("INSERT INTO stocks VALUES ('2006-01-05','BUY','RHAT',100,35.14)")

    # Save (commit) the changes
    conn.commit()


def get_stock_by_symbol(symbol: str):
    with connect() as conn:
        result_set = conn.execute(f'select * from stocks where symbol="{symbol}"')
        return json.dumps(_to_json(result_set))


def get_stocks():
    with connect() as conn:
        result_set = conn.execute('select * from stocks')
        return json.dumps(_to_json(result_set))


def _to_json(cursor: sqlite3.Cursor):
    return [dict((cursor.description[i][0], value) for i, value in enumerate(row)) for row in
            cursor.fetchall()] if cursor else list()


if __name__ == '__main__':
    print(get_stocks())
