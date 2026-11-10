import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {initial,type HomeData} from '../src/domain';
import {upgradeHomeAssets,attachFurnitureModel} from '../src/assets';
describe('사진과 모델 연결 및 기존 집 보존',()=>{
 it('사진에서 만든 모델을 연결해도 원본과 치수, 가구 ID를 보존한다',()=>{
  const photo={...initial.items[0],id:'my-chair',mode:'photo' as const,photo:'photo.jpg',sourcePhotos:['photo.jpg','back.jpg']};
  const linked=attachFurnitureModel(photo,'generated.glb','reconstruction');
  expect(linked.id).toBe(photo.id);expect(linked.photo).toBe(photo.photo);expect(linked.sourcePhotos).toEqual(photo.sourcePhotos);expect(linked.size).toEqual(photo.size);expect(linked.modelAsset?.origin).toBe('reconstruction');expect(linked.mode).toBe('glb');expect(photo.model).toBeUndefined();
 });
 it('기본 모델 교체 시 사용자 사진·좌표·회전·크기를 변경하지 않는다',()=>{
  const legacy:HomeData=structuredClone(initial);delete legacy.assetVersion;
  const item=legacy.items.find(i=>i.id==='i1')!;delete item.model;delete item.modelAsset;item.mode='basic';item.size=[1,.4,.6];
  const upgraded=upgradeHomeAssets(legacy);
  expect(upgraded.placements).toEqual(legacy.placements);expect(upgraded.items.find(i=>i.id==='i1')?.size).toEqual([1,.4,.6]);expect(upgraded.items.find(i=>i.id==='i1')?.model).toContain('modern_coffee_table_01');
  item.photo='my-photo.jpg';expect(upgradeHomeAssets(legacy).items.find(i=>i.id==='i1')).toEqual(item);
 });
 it('삭제한 기본 제공 가구를 재접속 때 되살리지 않는다',()=>{
  const data={...initial,items:initial.items.filter(i=>i.id!=='builtin-modern-arm-chair-01')};expect(upgradeHomeAssets(data)).toBe(data);
 });
});
describe('배포 에셋 무결성',()=>{
 const manifest=JSON.parse(readFileSync('public/assets/manifest.json','utf8')) as {path:string;bytes:number;sha256:string}[];
 it('다운로드한 모든 파일이 기록된 크기·해시와 일치한다',()=>{for(const entry of manifest){const bytes=readFileSync('public/'+entry.path);expect(bytes.length).toBe(entry.bytes);expect(createHash('sha256').update(bytes).digest('hex')).toBe(entry.sha256)}});
 for(const name of ['modern_coffee_table_01','modern_arm_chair_01','minoom-sofa','minoom-bed'])it(`${name}: 외부 파일 요청 없는 GLB다`,()=>{
  const b=readFileSync(`public/assets/models/${name}.glb`);expect(b.toString('utf8',0,4)).toBe('glTF');expect(b.readUInt32LE(4)).toBe(2);expect(b.readUInt32LE(8)).toBe(b.length);
  const n=b.readUInt32LE(12),g=JSON.parse(b.toString('utf8',20,20+n));expect(g.buffers).toHaveLength(1);expect(g.buffers[0].uri).toBeUndefined();expect(g.images.length).toBeGreaterThan(0);
  for(const image of g.images){expect(image.uri).toBeUndefined();expect(image.mimeType).toBe('image/jpeg');expect(g.bufferViews[image.bufferView].byteLength).toBeGreaterThan(0)}
  for(const view of g.bufferViews)expect((view.byteOffset||0)+view.byteLength).toBeLessThanOrEqual(g.buffers[0].byteLength);
 });
});
