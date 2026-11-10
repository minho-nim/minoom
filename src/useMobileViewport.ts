import {useEffect} from 'react';
import {canConsumeScroll} from './mobileInput';
export function useMobileViewport(){useEffect(()=>{
 const root=document.documentElement;const oldHeight=root.style.getPropertyValue('--app-height');let x=0,y=0;
 const size=()=>root.style.setProperty('--app-height',`${Math.round(window.visualViewport?.height||window.innerHeight)}px`);
 const reset=()=>window.dispatchEvent(new Event('minoom:input-reset'));
 const start=(e:TouchEvent)=>{const t=e.touches[0];if(t){x=t.clientX;y=t.clientY}};
 const move=(e:TouchEvent)=>{
  const t=e.touches[0];if(!t)return;const dx=t.clientX-x,dy=t.clientY-y;x=t.clientX;y=t.clientY;
  const target=e.target instanceof Element?e.target:null;
  if(target?.closest('input[type="range"]')){e.stopPropagation();return}
  let allow=false;
  if(e.touches.length===1){let el=target;while(el&&el!==document.body){if(el.matches('.panel,.modal,.filters,.editor-tools')){const horizontal=Math.abs(dx)>Math.abs(dy);if(horizontal?canConsumeScroll(el.scrollLeft,el.scrollWidth,el.clientWidth,dx):canConsumeScroll(el.scrollTop,el.scrollHeight,el.clientHeight,dy)){allow=true;break}}el=el.parentElement}}
  if(!allow&&e.cancelable)e.preventDefault();e.stopPropagation();
 };
 const visibility=()=>{if(document.hidden)reset()};
 size();window.addEventListener('resize',size);window.visualViewport?.addEventListener('resize',size);window.addEventListener('orientationchange',reset);window.addEventListener('blur',reset);document.addEventListener('visibilitychange',visibility);document.addEventListener('touchstart',start,{passive:true});document.addEventListener('touchmove',move,{passive:false});
 return()=>{root.style.setProperty('--app-height',oldHeight);window.removeEventListener('resize',size);window.visualViewport?.removeEventListener('resize',size);window.removeEventListener('orientationchange',reset);window.removeEventListener('blur',reset);document.removeEventListener('visibilitychange',visibility);document.removeEventListener('touchstart',start);document.removeEventListener('touchmove',move)};
 },[])}
