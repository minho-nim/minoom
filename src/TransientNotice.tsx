import {useEffect,useRef,useState,type ReactNode} from 'react';
import {scheduleNoticeDismiss} from './noticeTiming';
export function TransientNotice({noticeKey,onDismiss,className,children,role='status'}:{noticeKey:string;onDismiss:()=>void;className:string;children:ReactNode;role?:'status'|'alert'}){
 const [leaving,setLeaving]=useState(false);const dismiss=useRef(onDismiss);dismiss.current=onDismiss;
 useEffect(()=>{setLeaving(false);return scheduleNoticeDismiss(()=>setLeaving(true),()=>dismiss.current())},[noticeKey]);
 return <section className={`${className} transient-notice${leaving?' notice-leaving':''}`} role={role}>{children}</section>;
}
