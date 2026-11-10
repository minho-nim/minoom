import {describe,it,expect} from 'vitest';
import {initial,canWalk,validPlacement,bounds,doors} from '../src/domain';
describe('집 구조와 배치',()=>{
 it('외벽과 가구를 통과할 수 없다',()=>{expect(canWalk(6,2,initial)).toBe(false);expect(canWalk(-4.5,1.4,initial)).toBe(false);expect(canWalk(-2,3.5,initial)).toBe(true)});
 it('각 방문이 열린 경우 통로를 제공한다',()=>{for(const d of doors){expect(canWalk(d.x,d.z,initial)).toBe(true);expect(canWalk(d.x,d.z,{...initial,doors:{...initial.doors,[d.id]:false}})).toBe(false)}});
 it('벽 밖과 기존 가구 중첩을 거절한다',()=>{const i=initial.items[0];expect(validPlacement({id:'new',itemId:i.id,x:6,z:3,rotation:0,scale:1},i,initial)).toBe(false);expect(validPlacement({...initial.placements[0],id:'new'},i,initial)).toBe(false)});
 it('회전된 가구 경계를 계산한다',()=>{const b=bounds({...initial.placements[0],rotation:Math.PI/2},initial.items[0]);expect(b.w).toBeCloseTo(.95);expect(b.d).toBeCloseTo(2.5)});
 it('두 독립 방과 거실 사이 경로를 걸을 수 있다',()=>{for(const x of [-1.5,3])for(let z=-1;z<=1;z+=.1)expect(canWalk(x,z,initial)).toBe(true)});
});
