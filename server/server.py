from flask import Flask, request, make_response
from database import get_stocks, get_stock_by_symbol

app = Flask(__name__)
logger = app.logger


@app.route('/')
def hello():
    resp = make_response('Hello, World!')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Credentials'] = True
    return resp


@app.route('/stocks/')
@app.route('/stocks/<symbol>')
def get_stock(symbol: str = None):
    found = get_stock_by_symbol(symbol=symbol) if symbol else get_stocks()
    resp = make_response(found)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Credentials'] = True
    return resp


if __name__ == '__main__':
    app.run(port=8080, debug=True)
