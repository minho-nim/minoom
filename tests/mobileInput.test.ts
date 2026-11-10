import {describe,it,expect} from 'vitest';
import {canConsumeScroll,VirtualJoystick,isMouseFpsClick} from '../src/mobileInput';
describe('패널 스크롤 경계',()=>{
 it('목록 중간에서는 양방향 스크롤을 허용한다',()=>{expect(canConsumeScroll(200,1000,400,20)).toBe(true);expect(canConsumeScroll(200,1000,400,-20)).toBe(true)});
 it('상단과 하단에서 바깥 페이지로 넘기는 움직임은 막는다',()=>{expect(canConsumeScroll(0,1000,400,20)).toBe(false);expect(canConsumeScroll(600,1000,400,-20)).toBe(false);expect(canConsumeScroll(0,200,400,-20)).toBe(false)});
});
describe('이동과 시야 회전의 터치 분리',()=>{
 it('다른 손가락이 이동 입력을 덮어쓰거나 종료하지 않는다',()=>{const j=new VirtualJoystick();j.start(1,0,0);expect(j.move(2,100,100)).toBeNull();expect(j.end(2)).toBe(false);expect(j.move(1,35,0)).toEqual([1,0])});
 it('대각선 입력을 원 안으로 제한하고 미세한 떨림을 무시한다',()=>{const j=new VirtualJoystick();j.start(1,0,0);expect(j.move(1,1,1)).toEqual([0,0]);const v=j.move(1,70,70)!;expect(Math.hypot(...v)).toBeCloseTo(1)});
 it('캡처 손실 또는 포커스 해제 후에는 새 입력 전까지 움직이지 않는다',()=>{const j=new VirtualJoystick();j.start(1,0,0);j.move(1,20,0);j.end();expect(j.move(1,40,0)).toBeNull();expect(j.start(2,10,10)).toBe(true);expect(j.move(2,10,10)).toEqual([0,0])});
});

it('모바일 탭으로 FPS 잠금 요청을 시작하지 않는다',()=>{expect(isMouseFpsClick('touch',false)).toBe(false);expect(isMouseFpsClick('touch',true)).toBe(false);expect(isMouseFpsClick(undefined,false)).toBe(false);expect(isMouseFpsClick('mouse',true)).toBe(true)});
