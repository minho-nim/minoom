import {describe,it,expect} from 'vitest';
import {LookDrag} from '../src/controls';
describe('PC·터치 드래그 시야 입력',()=>{
 it('누르기 전 hover와 놓은 후 이동은 시야를 바꾸지 않는다',()=>{
  const drag=new LookDrag();expect(drag.move(1,50,50)).toEqual([0,0]);drag.start(1,50,50);expect(drag.move(1,62,45)).toEqual([12,-5]);drag.end(1);expect(drag.move(1,90,60)).toEqual([0,0]);expect(drag.active).toBe(false);
 });
 it('다른 손가락이 드래그 소유권이나 이전 좌표를 바꾸지 않는다',()=>{
  const drag=new LookDrag();expect(drag.start(4,10,10)).toBe(true);expect(drag.start(5,200,200)).toBe(false);expect(drag.move(5,300,300)).toEqual([0,0]);drag.end(5);expect(drag.active).toBe(true);expect(drag.move(4,14,18)).toEqual([4,8]);
 });
 it('포커스 손실·취소 후 새 드래그에 이전 이동량이 섞이지 않는다',()=>{
  const drag=new LookDrag();drag.start(1,0,0);drag.move(1,100,100);drag.end();expect(drag.move(1,500,500)).toEqual([0,0]);drag.start(2,20,30);expect(drag.move(2,21,28)).toEqual([1,-2]);
 });
});
