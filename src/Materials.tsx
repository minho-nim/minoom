import {publicAssetPath} from './assetPaths';
import {useMemo,useEffect,Suspense,Component,type ReactNode} from 'react';
import {useLoader} from '@react-three/fiber';
import {TextureLoader,RepeatWrapping,SRGBColorSpace,Vector2} from 'three';
export type SurfaceKind='wood'|'fabric'|'tile';
function Pbr({kind,repeat,color}:{kind:SurfaceKind;repeat:[number,number];color:string}){
 const source=useLoader(TextureLoader,['color','normal','roughness'].map(k=>publicAssetPath(`/assets/materials/${kind}/${k}.jpg`)));
 const [map,normalMap,roughnessMap]=useMemo(()=>source.map((t,i)=>{const clone=t.clone();clone.wrapS=clone.wrapT=RepeatWrapping;clone.repeat.set(...repeat);clone.anisotropy=4;if(i===0)clone.colorSpace=SRGBColorSpace;clone.needsUpdate=true;return clone}),[source,repeat[0],repeat[1]]);
 useEffect(()=>()=>{map.dispose();normalMap.dispose();roughnessMap.dispose()},[map,normalMap,roughnessMap]);
 return <meshStandardMaterial color={color} map={map} normalMap={normalMap} roughnessMap={roughnessMap} normalScale={new Vector2(kind==='fabric'?.35:.5,kind==='fabric'?.35:.5)} roughness={kind==='tile'?.55:.9}/>;
}
class MaterialBoundary extends Component<{children:ReactNode;color:string},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?<meshStandardMaterial color={this.props.color} roughness={.8}/>:this.props.children}}
export function SurfaceMaterial({kind,repeat=[1,1],color='#ffffff'}:{kind:SurfaceKind;repeat?:[number,number];color?:string}){return <MaterialBoundary color={color}><Suspense fallback={<meshStandardMaterial color={color} roughness={.8}/>}><Pbr kind={kind} repeat={repeat} color={color}/></Suspense></MaterialBoundary>}
export function FloorSurfaces(){return <><mesh rotation={[-Math.PI/2,0,0]} position={[0,-.014,0]} receiveShadow><planeGeometry args={[12,10]}/><SurfaceMaterial kind="wood" repeat={[12/1.3,10/1.3]}/></mesh><mesh rotation={[-Math.PI/2,0,0]} position={[4.75,.002,3.12]} receiveShadow><planeGeometry args={[2.34,3.6]}/><SurfaceMaterial kind="tile" repeat={[2.34,3.6]}/></mesh></>}
