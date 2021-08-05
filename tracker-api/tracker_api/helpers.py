# general helper functions

from datetime import date
from typing import DefaultDict


def date_keys_to_strings(o):
    """
    transforms all dateime.date keys in a dict/list to strings
    adapted from here: https://stackoverflow.com/questions/28079221/json-serializing-non-string-dictionary-keys
    """
    if isinstance(o, dict):
        for key in o:
            o[key] = date_keys_to_strings(o[key])
            if type(key) is date:
                o[key.isoformat()] = o[key]
                del o[key]
    elif isinstance(o, list):
        for item in o:
            item = date_keys_to_strings(item)
    return o
