/** Animate first, then remove; callers cancel when the current notice is replaced. */
export function scheduleNoticeDismiss(hide:()=>void,dismiss:()=>void,delay=4500,exitDuration=260){
 const hideTimer=setTimeout(hide,delay);
 const dismissTimer=setTimeout(dismiss,delay+exitDuration);
 return ()=>{clearTimeout(hideTimer);clearTimeout(dismissTimer)};
}
