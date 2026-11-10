import {describe,it,expect} from 'vitest';
import {publicAssetPath} from '../src/assetPaths';
describe('GitHub Pages 에셋 경로',()=>{
 it('프로젝트 경로 아래에서 저장된 모델과 재질을 불러온다',()=>{expect(publicAssetPath('/assets/models/chair.glb','/minoom-pages/')).toBe('/minoom-pages/assets/models/chair.glb');expect(publicAssetPath('/assets/materials/wood/color.jpg','/minoom-pages')).toBe('/minoom-pages/assets/materials/wood/color.jpg')});
 it('기존 루트 사이트의 주소를 유지한다',()=>{expect(publicAssetPath('/assets/models/chair.glb','/')).toBe('/assets/models/chair.glb')});
 it('사진 data URL과 외부 링크 및 비공개 저장소 경로는 바꾸지 않는다',()=>{for(const p of ['data:image/jpeg;base64,abc','https://example.com/photo.jpg','storage:home/photo.jpg'])expect(publicAssetPath(p,'/minoom-pages/')).toBe(p)});
});
