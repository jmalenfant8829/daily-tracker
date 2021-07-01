# general helper functions

from datetime import date
from typing import DefaultDict


def date_keys_to_strings(o):
    """
    transforms all dateime.date keys in a dict to strings
    adapted from here: https://stackoverflow.com/questions/28079221/json-serializing-non-string-dictionary-keys
    """
    if isinstance(o, dict) or isinstance(o, DefaultDict):
        for key in list(o.keys()):
            o[key] = date_keys_to_strings(o[key])
            if type(key) is date:
                o[key.isoformat()] = o[key]
                del o[key]
    return o
