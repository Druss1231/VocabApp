import os
import re
from datetime import datetime

def separate_words(r):
# Remove punctuation and split by spaces
    words = re.findall(r'\b\w+\b', r)
    unique_words = list(dict.fromkeys(words))
    return unique_words