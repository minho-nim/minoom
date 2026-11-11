import type {Item} from './domain';
export function PlacementFootprint({item,valid}:{item:Item;valid:boolean}){
 const w=item.size[0]+.06,d=item.size[2]+.06,color=valid?'#7a9658':'#d65443';
 return <group position={[0,.018,0]}><mesh rotation={[-Math.PI/2,0,0]}><planeGeometry args={[w,d]}/><meshBasicMaterial color={color} transparent opacity={.2} depthWrite={false}/></mesh><lineLoop raycast={()=>{}}><bufferGeometry><bufferAttribute attach="attributes-position" args={[new Float32Array([-w/2,0,-d/2,w/2,0,-d/2,w/2,0,d/2,-w/2,0,d/2]),3]}/></bufferGeometry><lineBasicMaterial color={color}/></lineLoop></group>;
}
