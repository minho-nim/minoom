"""Download approved CC0 assets and build self-contained GLB / 1K JPG maps.
Requires Python Pillow. Run manually, never on page load. Downloads are cached in /tmp.
"""
import json,urllib.request,hashlib,struct,io,zipfile,concurrent.futures
from pathlib import Path
from PIL import Image,ImageOps
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'public/assets';CACHE=Path('/tmp/minoom-approved-assets');CACHE.mkdir(exist_ok=True)
def fetch(url):
 p=CACHE/hashlib.sha256(url.encode()).hexdigest()
 if not p.exists():
  req=urllib.request.Request(url,headers={'User-Agent':'minoom/0.1 personal CC0 asset preparation'})
  p.write_bytes(urllib.request.urlopen(req,timeout=90).read())
 return p.read_bytes()
def jpeg(data,max_size=1024):
 im=Image.open(io.BytesIO(data)).convert('RGB');im.thumbnail((max_size,max_size),Image.Resampling.LANCZOS);buf=io.BytesIO();im.save(buf,format='JPEG',quality=85,optimize=True);return buf.getvalue()
def model(asset):
 meta=json.loads(fetch('https://api.polyhaven.com/files/'+asset))['gltf']['1k']['gltf'];g=json.loads(fetch(meta['url']));includes=meta['include'];blob=bytearray();offsets=[]
 def append(data):
  blob.extend(b'\0'*((-len(blob))%4));offset=len(blob);blob.extend(data);return offset
 for b in g['buffers']:offsets.append(append(fetch(includes[b['uri']]['url'])))
 for v in g['bufferViews']:v['byteOffset']=v.get('byteOffset',0)+offsets[v.get('buffer',0)];v['buffer']=0
 for im in g.get('images',[]):
  data=jpeg(fetch(includes[im.pop('uri')]['url']));offset=append(data);im['bufferView']=len(g['bufferViews']);im['mimeType']='image/jpeg';g['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':len(data)})
 if asset=='modern_coffee_table_01':
  for scene in g['scenes']:
   g['nodes'].append({'name':'minoom width alignment','rotation':[0,2**-.5,0,2**-.5],'children':scene['nodes']});scene['nodes']=[len(g['nodes'])-1]
 g['buffers']=[{'byteLength':len(blob)}];g['asset']['extras']={'source':'https://polyhaven.com/a/'+asset,'license':'CC0-1.0'}
 j=json.dumps(g,separators=(',',':')).encode();j+=b' '*((-len(j))%4);blob.extend(b'\0'*((-len(blob))%4))
 result=struct.pack('<III',0x46546c67,2,12+8+len(j)+8+len(blob))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(blob),0x004e4942)+blob
 (OUT/'models'/f'{asset}.glb').write_bytes(result);print(asset,len(result),'bytes',flush=True)
def surface(pair):
 asset,folder=pair;z=zipfile.ZipFile(io.BytesIO(fetch(f'https://ambientcg.com/get?file={asset}_1K-JPG.zip')));dest=OUT/'materials'/folder;dest.mkdir(parents=True,exist_ok=True)
 for source,target in [('Color','color'),('NormalGL','normal'),('Roughness','roughness')]:
  name=next(n for n in z.namelist() if n.endswith(f'_{source}.jpg'));(dest/f'{target}.jpg').write_bytes(jpeg(z.read(name)))
 print(asset,'material ready',flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
 tasks=[pool.submit(model,a) for a in ['modern_coffee_table_01','modern_arm_chair_01']]+[pool.submit(surface,p) for p in [('WoodFloor050','wood'),('Fabric030','fabric'),('Tiles107','tile')]]
 for task in tasks:task.result()
linen=OUT/'materials/linen';linen.mkdir(exist_ok=True)
im=Image.open(OUT/'materials/fabric/color.jpg').convert('L').point(lambda x:round(226+(x-128)*.19));ImageOps.colorize(im,black='#d7cfc0',white='#fffdf5').save(linen/'color.jpg',quality=88,optimize=True)
manifest=[]
for p in sorted(OUT.rglob('*')):
 if p.is_file() and p.name!='manifest.json':manifest.append({'path':str(p.relative_to(ROOT/'public')),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
