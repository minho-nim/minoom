import {afterEach,describe,it,expect,vi} from 'vitest';
import {scheduleNoticeDismiss} from '../src/noticeTiming';
afterEach(()=>vi.useRealTimers());
describe('안내 자동 닫기',()=>{
 it('안내를 보여준 뒤 내려가는 전환 후 제거한다',()=>{vi.useFakeTimers();const hide=vi.fn(),dismiss=vi.fn();scheduleNoticeDismiss(hide,dismiss);vi.advanceTimersByTime(4499);expect(hide).not.toHaveBeenCalled();vi.advanceTimersByTime(1);expect(hide).toHaveBeenCalledOnce();expect(dismiss).not.toHaveBeenCalled();vi.advanceTimersByTime(260);expect(dismiss).toHaveBeenCalledOnce()});
 it('안내가 교체되거나 직접 닫히면 이전 타이머가 새 안내를 지우지 않는다',()=>{vi.useFakeTimers();const dismiss=vi.fn();const cancel=scheduleNoticeDismiss(vi.fn(),dismiss);vi.advanceTimersByTime(1000);cancel();vi.advanceTimersByTime(10000);expect(dismiss).not.toHaveBeenCalled()});
});
