#!/usr/bin/env python3

# usage: to_flashcards.py data_dir output_dir packages...

import os
import sys
import json

data_dir = sys.argv[1]
output_dir = sys.argv[2]
packages = sys.argv[3:]

tex_text = open(os.path.join(output_dir, 'text_text.tex'), 'w')
tex_ruby = open(os.path.join(output_dir, 'text_ruby.tex'), 'w')
tex_both = open(os.path.join(output_dir, 'text_both.tex'), 'w')

header = r'''
\documentclass[letterpaper]{article}
\usepackage{xeCJK}
\usepackage{fontspec}
\usepackage[landscape,margin=0in]{geometry}
\usepackage{nopageno}

\setmainfont{Noto Sans}
\setCJKmainfont{Noto Sans CJK SC}
\topskip0in
\setlength{\tabcolsep}{0.2in}
\renewcommand{\arraystretch}{1.2}

\begin{document}
\begin{center}
\fontsize{1in}{1in}\selectfont
'''

footer = r'''
\end{center}
\end{document}
'''

newpage = ''
newpage_next = r'''
\newpage
'''

card_header = r'''
\vspace*{\fill}
\begin{tabular}{%s}
'''

card_footer = r'''
\end{tabular}
\vspace*{\fill}
'''

counter = 0

print(header, file=tex_text)
print(header, file=tex_ruby)
print(header, file=tex_both)

if len(packages) == 0:
    with open(os.path.join(data_dir, 'index.json'), 'r') as jsonfile:
        package_index = json.load(jsonfile)
        packages = [x['id'] for x in package_index]

for package in packages:
    with open(os.path.join(data_dir, package, 'index.json'), 'r') as jsonfile:
        for card in json.load(jsonfile):
            os.symlink(
                os.path.abspath(os.path.join(data_dir, package, card['image'])),
                os.path.join(output_dir, 'img_%09d_%s' % (counter, card['image']))
            )
            counter += 1
            ruby_array = card['ruby'].split()
            text_array = list(card['text'])
            header_spec = 'c' * max(len(ruby_array), len(text_array))
            print(newpage, file=tex_text)
            print(newpage, file=tex_ruby)
            print(newpage, file=tex_both)
            newpage = newpage_next
            print(card_header % header_spec, file=tex_text)
            print(card_header % header_spec, file=tex_ruby)
            print(card_header % header_spec, file=tex_both)
            ruby_line = ' & '.join(ruby_array) + r'\\'
            text_line = ' & '.join(text_array) + r'\\'
            print(ruby_line, file=tex_ruby)
            print(ruby_line, file=tex_both)
            print(text_line, file=tex_both)
            print(text_line, file=tex_text)
            print(card_footer, file=tex_text)
            print(card_footer, file=tex_ruby)
            print(card_footer, file=tex_both)

print(footer, file=tex_text)
print(footer, file=tex_ruby)
print(footer, file=tex_both)

tex_text.close()
tex_ruby.close()
tex_both.close()
