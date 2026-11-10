export type LockIssue={reason:'unsupported'|'focus'|'restricted'|'denied'|'unknown';title:string;message:string};
/** Explain observable failures without treating every rejection as lack of API support. */
export function explainLockFailure(error:unknown,context:{supported:boolean;focused:boolean;embedded:boolean}):LockIssue {
 const name=error&&typeof error==='object'&&'name' in error?String(error.name):'';
 if(!context.supported||name==='NotSupportedError')return {reason:'unsupported',title:'이 환경에서는 FPS 조작을 사용할 수 없어요',message:'PC의 Chrome 또는 Edge에서 열어주세요. 여기서는 드래그로 둘러볼 수 있습니다.'};
 if(!context.focused)return {reason:'focus',title:'게임 화면을 한 번 더 눌러주세요',message:'창에 포커스가 없어 마우스를 잠그지 못했습니다. 화면을 누른 뒤 다시 시작해주세요.'};
 if(context.embedded&&name==='SecurityError')return {reason:'restricted',title:'현재 창에서 마우스 잠금이 제한됐어요',message:'새 탭이나 일반 PC 브라우저에서 다시 시도해주세요. 이 창의 권한은 앱에서 변경할 수 없습니다.'};
 if(name==='NotAllowedError'||name==='SecurityError')return {reason:'denied',title:'마우스 잠금 요청이 허용되지 않았어요',message:'브라우저 권한이나 창의 제한이 원인일 수 있습니다. FPS를 다시 시작하거나 일반 PC 브라우저에서 열어주세요.'};
 return {reason:'unknown',title:'FPS 조작을 시작하지 못했어요',message:'마우스 잠금 요청이 실패했습니다. 다시 시도하거나 새 탭에서 열어주세요. 드래그 조작도 선택할 수 있습니다.'};
}
