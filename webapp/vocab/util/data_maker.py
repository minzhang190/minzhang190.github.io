#!/usr/bin/env python3

import sys
if len(sys.argv) < 4:
    print('usage: data_maker.py csv_file image_dir output_dir')
    sys.exit(1)

import os
os.makedirs(sys.argv[3])

words = []

import csv
import hashlib
import shutil
import urllib.request
import urllib.parse
from pypinyin import pinyin

opener = urllib.request.build_opener()
opener.addheaders = [('User-agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36')]
urllib.request.install_opener(opener)

with open(sys.argv[1], 'r', newline='') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        if len(row) != 2:
            continue
        word, image = row
        word = word.strip()
        image = image.strip()
        md5 = hashlib.md5(word.encode('utf-8')).hexdigest()
        ruby = ' '.join(x[0] for x in pinyin(word))
        url = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=zh-CN&client=tw-ob&q=' + urllib.parse.quote(word.encode('utf-8'))
        print(word, ruby, image, md5)
        print(url)
        shutil.copyfile(
            os.path.join(sys.argv[2], image + '@2x.png'),
            os.path.join(sys.argv[3], image + '.png')
        )
        urllib.request.urlretrieve(url,
            os.path.join(sys.argv[3], md5 + '.mp3')
        )
        words.append({
            'image': image + '.png',
            'text': word,
            'ruby': ruby,
            'audio': md5 + '.mp3',
        })

import json
with open(os.path.join(sys.argv[3], 'index.json'), 'w') as jsonfile:
    json.dump(words, jsonfile, ensure_ascii=False, indent='\t')
