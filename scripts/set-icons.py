#!/usr/bin/env python3
"""Set `icon:` in a chapter's frontmatter. Usage: set-icons.py <guide dir> NN=emoji ..."""
import glob, os, re, sys

guide = sys.argv[1]
icons = dict(a.split('=', 1) for a in sys.argv[2:])
for path in sorted(glob.glob(os.path.join(guide, '*.md'))):
    m = re.search(r' - (\d+)\. ', os.path.basename(path))
    if not m or m.group(1) not in icons:
        continue
    text = open(path, encoding='utf-8').read()
    if not text.startswith('---\n'):
        continue
    end = text.index('\n---', 4)
    front = text[4:end]
    front = re.sub(r'^icon:.*\n?', '', front, flags=re.M).rstrip('\n')
    text = '---\n' + front + f'\nicon: "{icons[m.group(1)]}"' + text[end:]
    open(path, 'w', encoding='utf-8').write(text)
    print(m.group(1), icons[m.group(1)], os.path.basename(path))
