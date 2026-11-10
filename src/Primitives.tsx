import {RoundedBox} from '@react-three/drei';
import {SurfaceMaterial,type SurfaceKind} from './Materials';
export function Box({p,s,c='#d5c4ab',r=.025,surface,...props}:{p:[number,number,number];s:[number,number,number];c?:string;r?:number;surface?:SurfaceKind;[key:string]:unknown}){return <RoundedBox position={p} args={s} radius={Math.min(r,...s.map(n=>n*.45))} smoothness={2} castShadow receiveShadow {...props}>{surface?<SurfaceMaterial kind={surface} color={c} repeat={[Math.max(s[0],.5),Math.max(s[2],.5)]}/>:<meshStandardMaterial color={c} roughness={.75}/>}</RoundedBox>}
