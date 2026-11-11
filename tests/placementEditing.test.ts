import {describe,it,expect} from 'vitest';
import {movePlacement,rotatePlacement,commitPlacement} from '../src/placementEditing';
import {initial,validPlacement} from '../src/domain';
describe('가구 미리보기와 확정',()=>{
 it('드래그 중 기존 저장 데이터와 방향·크기를 변경하지 않는다',()=>{const source=structuredClone(initial);const p=source.placements[0],before={...p};const moved=movePlacement(p,1.123,-2.127);expect(moved.x).toBe(1.1);expect(moved.z).toBe(-2.15);expect(moved.rotation).toBe(p.rotation);expect(moved.scale).toBe(p.scale);expect(source.placements[0]).toEqual(before);expect(movePlacement(p,NaN,3)).toEqual(p)});
 it('45도 회전 후 범위와 충돌을 검사할 수 있다',()=>{const p={...initial.placements[0],rotation:Math.PI*.9};const rotated=rotatePlacement(p,Math.PI/4);expect(rotated.rotation).toBeGreaterThanOrEqual(-Math.PI);expect(rotated.rotation).toBeLessThanOrEqual(Math.PI);expect(p.rotation).toBe(Math.PI*.9);expect(validPlacement({...rotated,x:5.8,z:0},initial.items[0],initial)).toBe(false)});
 it('확정할 때만 기존 가구를 교체하거나 새 배치를 한 번 추가한다',()=>{const p=initial.placements[0];const changed=commitPlacement(initial,{...p,x:p.x+.1});expect(changed.placements).toHaveLength(initial.placements.length);expect(initial.placements[0].x).toBe(p.x);expect(changed.placements[0].x).toBe(p.x+.1);const fresh={...p,id:'new'};const once=commitPlacement(initial,fresh);expect(commitPlacement(once,{...fresh,z:1}).placements).toHaveLength(initial.placements.length+1)});
});
