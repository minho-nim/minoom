"""Prepare the small locally hosted Jua title/menu subset; requires fontTools."""
from pathlib import Path
from fontTools import subset
import urllib.request
root=Path(__file__).resolve().parents[1];out=root/'public/assets/fonts';out.mkdir(exist_ok=True)
source=Path('/tmp/minoom-jua.ttf');base='https://raw.githubusercontent.com/google/fonts/main/ofl/jua/'
if not source.exists():source.write_bytes(urllib.request.urlopen(base+'Jua-Regular.ttf',timeout=30).read())
license=out/'OFL-Jua.txt'
if not license.exists():license.write_bytes(urllib.request.urlopen(base+'OFL.txt',timeout=30).read())
options=subset.Options();options.flavor='woff';font=subset.load_font(str(source),options);worker=subset.Subsetter(options=options)
worker.populate(text=''.join((root/p).read_text() for p in ['src/App.tsx','src/domain.ts']));worker.subset(font);subset.save_font(font,str(out/'minoom-round.woff'),options)
