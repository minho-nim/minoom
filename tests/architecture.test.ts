import {describe,it,expect} from 'vitest';
import {windowOpenings,westWallPanels} from '../src/architecture';
import {canWalk,initial} from '../src/domain';
describe('실제 창 개구부와 외벽',()=>{
 const panels=westWallPanels();
 const covered=(z:number,y:number)=>panels.some(p=>Math.abs(p.z-z)<p.length/2&&Math.abs(p.y-y)<p.height/2);
 it('창 중앙의 눈높이에 불투명 벽이 남지 않는다',()=>{for(const w of windowOpenings)expect(covered(w.z,1.5)).toBe(false)});
 it('창 아래·위와 창 사이 외벽은 막혀 있다',()=>{for(const w of windowOpenings){expect(covered(w.z,.3)).toBe(true);expect(covered(w.z,2.55)).toBe(true)}expect(covered(0,1.5)).toBe(true)});
 it('시각적 창을 추가해도 외부로 걸어 나갈 수 없다',()=>{for(const w of windowOpenings){expect(canWalk(-5.95,w.z,initial)).toBe(false);expect(canWalk(-6.2,w.z,initial)).toBe(false)}});
});
