import os
import sys
from pathlib import Path


def get_root_dir():
    if hasattr(sys, 'frozen'):
        return os.path.dirname(os.path.abspath(sys.executable))
    else:
        return Path(os.path.abspath(__file__)).parents[1]
