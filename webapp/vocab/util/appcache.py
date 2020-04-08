#!/usr/bin/env python3

import os
import hashlib

print('''CACHE MANIFEST
# v1

CACHE:
''')

# https://stackoverflow.com/questions/3431825/generating-an-md5-checksum-of-a-file
def md5(fname):
    hash_md5 = hashlib.md5()
    with open(fname, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

for root, dirs, files in os.walk('.'):
    if root == '.':
        if '.git' in dirs:
            dirs.remove('.git')
        dirs.remove('util')
        files.remove('manifest.appcache')
    for fn in files:
        print(os.path.join(root.lstrip('.').lstrip('/'), fn))
        print('#', md5(os.path.join(root, fn)))
        print()

print('''NETWORK:

*

FALLBACK:''')
