import {create} from 'zustand';
import {upgradeHomeAssets} from './assets';
import {initial,type HomeData} from './domain';
let data=structuredClone(initial);try{const saved=localStorage.getItem('ongi-local-v1');if(saved)data=upgradeHomeAssets(JSON.parse(saved))}catch{ /* keep defaults */ }
export const useHome=create<{data:HomeData;mode:'life'|'overview'|'editor';panel:string|null;selected:string|null;error:string;persist:boolean;set:(patch:object)=>void;update:(data:HomeData)=>void}>(set=>({data,mode:'life',panel:null,selected:null,error:'',persist:true,set:patch=>set(patch),update:data=>{try{if(useHome.getState().persist)localStorage.setItem('ongi-local-v1',JSON.stringify(data));set({data})}catch{set({error:'저장 공간이 부족합니다. 작은 사진을 사용해주세요.'})}}}));
export const input={x:0,z:0,lookX:0,lookY:0,interact:false};
export const player={x:-2,z:3.5,yaw:0,action:'idle',emotion:'',seat:''};
