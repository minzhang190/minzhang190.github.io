#!/usr/bin/env python3

# usage: explain.py data_dir

import os
import sys
import json
import re

data_dir = sys.argv[1]

with open(os.path.join(data_dir, 'index.json'), 'r') as jsonfile:
    package_index = json.load(jsonfile)
    packages = [x['id'] for x in package_index]

for package in packages:
    with open(os.path.join(data_dir, package, 'index.json'), 'r') as jsonfile:
        package_data = json.load(jsonfile)
    for card in package_data:
        if 'explain' not in card:
            explain = card['image']
            explain = explain.split('.')[0]
            explain = explain.split('_')[0]
            explain = re.sub('[A-Z]', lambda m: ' ' + m.group().lower(), explain)
            card['explain'] = explain
    with open(os.path.join(data_dir, package, 'index.json'), 'w') as jsonfile:
        json.dump(package_data, jsonfile, ensure_ascii=False, indent='\t')
