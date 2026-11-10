import type {HomeData,Item} from './domain';
export type ModelOrigin = 'builtin' | 'upload' | 'reconstruction';
export type ModelAsset = {origin:ModelOrigin;sourceUrl?:string;license?:string;preview?:string};
export const tableAsset={model:'/assets/models/modern_coffee_table_01.glb',modelAsset:{origin:'builtin',sourceUrl:'https://polyhaven.com/a/modern_coffee_table_01',license:'CC0-1.0',preview:'/assets/previews/table.jpg'}} as const;
export const loungeChair:Item={id:'builtin-modern-arm-chair-01',name:'원목 라운지 체어',kind:'의자',size:[.83,.9,.86],mode:'glb',model:'/assets/models/modern_arm_chair_01.glb',modelAsset:{origin:'builtin',sourceUrl:'https://polyhaven.com/a/modern_arm_chair_01',license:'CC0-1.0',preview:'/assets/previews/chair.jpg'},creator:'기본 제공 · Poly Haven',created:'2026-11-10T00:00:00.000Z',updated:'2026-11-10T00:00:00.000Z'};
/** Upgrade only the untouched starter table; preserve all user photos, sizes and placements. */
export function upgradeHomeAssets(data:HomeData):HomeData {
 if((data.assetVersion||0)>=1)return data;
 const items=data.items.map(i=>i.id==='i1'&&i.name==='오크 커피 테이블'&&i.creator==='우리'&&i.mode==='basic'&&!i.photo&&!i.model?{...i,...tableAsset,mode:'glb' as const}:i);
 if(!items.some(i=>i.id===loungeChair.id))items.push(structuredClone(loungeChair));
 return {...data,items,assetVersion:1};
}
/** A later reconstruction provider can use this same attachment path without recreating placements. */
export function attachFurnitureModel(item:Item,model:string,origin:ModelOrigin):Item {
 return {...item,model,mode:'glb',modelAsset:{origin},updated:new Date().toISOString()};
}
