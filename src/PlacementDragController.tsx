import {useEffect,useRef} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import type {Placement} from './domain';
import {useHome} from './store';
import {movePlacement} from './placementEditing';
export function PlacementDragController({draft,onChange}:{draft:Placement|null|undefined;onChange:(p:Placement)=>void}){
 const {camera,scene,gl,controls}=useThree();const finishRef=useRef<()=>void>(()=>{});const latest=useRef({draft,onChange});latest.current={draft,onChange};
 useEffect(()=>{
  const canvas=gl.domElement,raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),floor=new THREE.Plane(new THREE.Vector3(0,1,0),0);const orbit=controls as unknown as {enabled:boolean}|undefined;
  let gesture:{id:number;p:Placement;offsetX:number;offsetZ:number;orbitEnabled:boolean}|null=null;
  const floorPoint=(e:PointerEvent)=>{const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);return raycaster.ray.intersectPlane(floor,new THREE.Vector3())};
  const stop=(e:PointerEvent)=>{e.preventDefault();e.stopImmediatePropagation()};
  const finish=()=>{if(!gesture)return;const previous=gesture;gesture=null;if(orbit)orbit.enabled=previous.orbitEnabled;if(canvas.hasPointerCapture(previous.id))canvas.releasePointerCapture(previous.id);canvas.classList.remove('moving-furniture')};
  finishRef.current=finish;
  const outside=(e:PointerEvent)=>{if(e.target!==canvas)finish()};
  const down=(e:PointerEvent)=>{
   if(useHome.getState().panel||e.button!==0)return;if(gesture){stop(e);return}if(e.pointerType==='touch'&&!e.isPrimary)return;
   const point=floorPoint(e);if(!point)return;
   let id:string|undefined;
   for(const hit of raycaster.intersectObjects(scene.children,true)){let obj:THREE.Object3D|null=hit.object;while(obj&&!obj.userData.placementId)obj=obj.parent;if(obj?.userData.placementId){id=obj.userData.placementId;break}}
   if(!id)return;
   const pending=latest.current.draft;
   if(pending&&pending.id!==id){stop(e);useHome.getState().set({error:'현재 가구를 확정하거나 취소한 뒤 다른 가구를 선택해주세요.'});return}
   const p=pending?.id===id?pending:useHome.getState().data.placements.find(p=>p.id===id);if(!p)return;
   stop(e);gesture={id:e.pointerId,p:{...p},offsetX:p.x-point.x,offsetZ:p.z-point.z,orbitEnabled:orbit?.enabled??true};if(orbit)orbit.enabled=false;canvas.setPointerCapture(e.pointerId);canvas.classList.add('moving-furniture');useHome.getState().set({selected:p.id});latest.current.onChange({...p});
  };
  const move=(e:PointerEvent)=>{if(!gesture)return;stop(e);if(gesture.id!==e.pointerId)return;const point=floorPoint(e);if(point)latest.current.onChange(movePlacement(gesture.p,point.x+gesture.offsetX,point.z+gesture.offsetZ))};
  const up=(e:PointerEvent)=>{if(!gesture)return;stop(e);if(gesture.id===e.pointerId)finish()};
  const unsubscribe=useHome.subscribe(s=>{if(s.panel)finish()});
  document.addEventListener('pointerdown',outside,true);canvas.addEventListener('pointerdown',down,true);canvas.addEventListener('pointermove',move,true);canvas.addEventListener('pointerup',up,true);canvas.addEventListener('pointercancel',up,true);canvas.addEventListener('lostpointercapture',up,true);window.addEventListener('blur',finish);window.addEventListener('minoom:input-reset',finish);
  return()=>{finish();finishRef.current=()=>{};unsubscribe();document.removeEventListener('pointerdown',outside,true);canvas.removeEventListener('pointerdown',down,true);canvas.removeEventListener('pointermove',move,true);canvas.removeEventListener('pointerup',up,true);canvas.removeEventListener('pointercancel',up,true);canvas.removeEventListener('lostpointercapture',up,true);window.removeEventListener('blur',finish);window.removeEventListener('minoom:input-reset',finish)};
 },[camera,scene,gl,controls]);
 useEffect(()=>{if(!draft)finishRef.current()},[Boolean(draft)]);
 return null;
}
