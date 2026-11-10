import {describe,it,expect} from 'vitest';
import {explainLockFailure} from '../src/pointerLock';
const context={supported:true,focused:true,embedded:false};
describe('마우스 잠금 오류 분류',()=>{
 it('권한 거절을 브라우저 미지원으로 단정하지 않는다',()=>{expect(explainLockFailure({name:'NotAllowedError'},context).reason).toBe('denied')});
 it('임베드 SecurityError를 창 제한으로 안내한다',()=>{expect(explainLockFailure({name:'SecurityError'},{...context,embedded:true}).reason).toBe('restricted')});
 it('API 부재를 구분한다',()=>{expect(explainLockFailure(undefined,{...context,supported:false}).reason).toBe('unsupported')});
 it('창 포커스가 없으면 재시도를 안내한다',()=>{expect(explainLockFailure(undefined,{...context,focused:false}).reason).toBe('focus')});
 it('원인을 알 수 없는 native error는 미지원으로 표시하지 않는다',()=>{expect(explainLockFailure(undefined,context).reason).toBe('unknown')});
});
