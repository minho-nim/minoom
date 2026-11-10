export type Kind='소파'|'침대'|'테이블'|'의자'|'책상'|'조명'|'수납장'|'장식품'|'기타';
export type Item={id:string;name:string;kind:Kind;size:[number,number,number];photo?:string;model?:string;mode:'basic'|'photo'|'glb';creator:string;created:string;updated:string};
export type Placement={id:string;itemId:string;x:number;z:number;rotation:number;scale:number};
export type HomeData={items:Item[];placements:Placement[];lights:boolean;doors:Record<string,boolean>};
export type Rect={x:number;z:number;w:number;d:number;id?:string};
export const categories:Kind[]=['소파','침대','테이블','의자','책상','조명','수납장','장식품','기타'];
// 12m × 10m. Two enclosed rooms north, bathroom south east, common living south west.
export const walls:Rect[]=[{x:0,z:-5,w:12,d:.16},{x:0,z:5,w:12,d:.16},{x:-6,z:0,w:.16,d:10},{x:6,z:0,w:.16,d:10},{x:0,z:-2.5,w:.14,d:5},{x:-4,z:0,w:4,d:.14},{x:-.5,z:0,w:1,d:.14},{x:1,z:0,w:2,d:.14},{x:5,z:0,w:2,d:.14},{x:3.5,z:3.8,w:.14,d:2.4},{x:3.5,z:.6,w:.14,d:1.2},{x:4.75,z:1.2,w:2.5,d:.14}];
export const doors=[{id:'bedroom',x:-1.5,z:0,axis:'x'},{id:'studio',x:3,z:0,axis:'x'},{id:'bath',x:3.5,z:1.9,axis:'z'}];
const raw:[string,Kind,number,number,number,number,number,number][]=[['패브릭 소파','소파',2.5,.85,.95,-4.5,1.4,Math.PI/2],['오크 커피 테이블','테이블',1.15,.42,.65,-2.9,1.5,0],['낮은 TV 수납장','수납장',.45,.5,2,-.35,2.2,0],['따뜻한 플로어 램프','조명',.45,1.7,.45,-5.2,3.9,0],['우리의 침대','침대',1.8,.7,2.1,-4,-3.4,0],['침실 옷장','수납장',1.6,2.15,.6,-1.2,-4.5,0],['침대 옆 협탁','수납장',.5,.5,.5,-5.3,-3.6,0],['작업 책상','책상',1.6,.75,.7,3.7,-4.3,0],['작업 의자','의자',.55,.9,.55,3.7,-3.3,0],['취미방 책장','수납장',.65,1.8,1.4,.5,-3.3,0],['함께 먹는 식탁','테이블',1.2,.75,.8,1.8,3.6,0],['식탁 의자 A','의자',.5,.85,.5,1.8,2.75,0],['식탁 의자 B','의자',.5,.85,.5,1.8,4.4,Math.PI],['창가 화분','장식품',.5,.8,.5,-5.2,-.7,0]];
export const initial:HomeData={items:raw.map((r,i)=>({id:`i${i}`,name:r[0],kind:r[1],size:[r[2],r[3],r[4]],mode:'basic',creator:'우리',created:new Date().toISOString(),updated:new Date().toISOString()})),placements:raw.map((r,i)=>({id:`p${i}`,itemId:`i${i}`,x:r[5],z:r[6],rotation:r[7],scale:1})),lights:true,doors:{bedroom:true,studio:true,bath:true}};
export function bounds(p:Placement,i:Item):Rect { const c=Math.abs(Math.cos(p.rotation)),s=Math.abs(Math.sin(p.rotation));return {id:p.id,x:p.x,z:p.z,w:(i.size[0]*c+i.size[2]*s)*p.scale,d:(i.size[0]*s+i.size[2]*c)*p.scale}; }
export const overlaps=(a:Rect,b:Rect,pad=0)=>Math.abs(a.x-b.x)<(a.w+b.w)/2+pad&&Math.abs(a.z-b.z)<(a.d+b.d)/2+pad;
export function obstacles(data:HomeData):Rect[]{return [...walls,...doors.filter(d=>!data.doors[d.id]).map(d=>({x:d.x,z:d.z,w:d.axis==='x'?2:.14,d:d.axis==='x'?.14:1.4})),...data.placements.flatMap(p=>{const i=data.items.find(i=>i.id===p.itemId);return i?[bounds(p,i)]:[]}),{x:1,z:.5,w:2.4,d:.75},{x:5.3,z:4.5,w:1,d:.6},{x:5.2,z:2,w:.7,d:.7}];}
export function validPlacement(p:Placement,i:Item,data:HomeData){const b=bounds(p,i);return b.w<=5&&b.d<=5&&Math.abs(b.x)+b.w/2<5.9&&Math.abs(b.z)+b.d/2<4.9&&!obstacles(data).filter(o=>o.id!==p.id).some(o=>overlaps(b,o,.03));}
export function canWalk(x:number,z:number,data:HomeData){return Math.abs(x)<5.72&&Math.abs(z)<4.72&&!obstacles(data).some(o=>overlaps({x,z,w:.36,d:.36},o));}
export interface PhotoReconstructionProvider { reconstruct(photos:Blob[],dimensions:Item['size']):Promise<Blob> }
