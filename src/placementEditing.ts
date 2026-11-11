import type {Placement,HomeData} from './domain';
export function movePlacement(p:Placement,x:number,z:number):Placement{
 if(!Number.isFinite(x)||!Number.isFinite(z))return {...p};
 const snap=(n:number)=>Math.round(Math.max(-5.8,Math.min(5.8,n))*20)/20;
 return {...p,x:snap(x),z:snap(z)};
}
export function rotatePlacement(p:Placement,delta:number):Placement{return {...p,rotation:Math.atan2(Math.sin(p.rotation+delta),Math.cos(p.rotation+delta))}}
export function commitPlacement(data:HomeData,p:Placement):HomeData{return {...data,placements:data.placements.some(v=>v.id===p.id)?data.placements.map(v=>v.id===p.id?{...p}:v):[...data.placements,{...p}]}}
