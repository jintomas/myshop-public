from . import _sqlite_impl


def connect() -> str:
    return _sqlite_impl.connect()


def get_stock_by_symbol(symbol: str) -> str:
    return _sqlite_impl.get_stock_by_symbol(symbol=symbol)


def get_stocks() -> str:
    return _sqlite_impl.get_stocks()
