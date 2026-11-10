import {useMemo} from 'react';
import * as THREE from 'three';
import {Box} from './Primitives';
import {windowOpenings,westWallPanels} from './architecture';
function Curtain({z,side}:{z:number;side:number}){
 const geometry=useMemo(()=>{const points:number[]=[],uv:number[]=[],index:number[]=[];const nx=26,ny=8;
  for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){const u=i/nx,v=j/ny;points.push(Math.sin(u*Math.PI*12)*.035+(1-v)*.025, .18+v*2.17+Math.sin(u*Math.PI*12)*.008,side*(u*.34));uv.push(u,v)}
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i;index.push(a,a+1,a+nx+2,a,a+nx+2,a+nx+1)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(index);g.computeVertexNormals();return g;
 },[side]);
 return <mesh position={[-5.72,0,z]} geometry={geometry} receiveShadow><meshStandardMaterial color="#eee6d5" roughness={.98} side={THREE.DoubleSide}/></mesh>;
}
export function WindowFacade(){return <group>
 {westWallPanels().map((p,i)=><Box key={i} p={[-6,p.y,p.z]} s={[.16,p.height,p.length]} c="#f1eee6" r={.006}/>)}
 {windowOpenings.map(w=><group key={w.id}>
  <mesh position={[-6.025,(w.sill+w.head)/2,w.z]} rotation={[0,Math.PI/2,0]}><planeGeometry args={[w.width,w.head-w.sill]}/><meshStandardMaterial color="#bed1d5" transparent opacity={.13} roughness={.15} metalness={.12} side={THREE.DoubleSide} depthWrite={false}/></mesh>
  {[w.sill,w.head].map(y=><Box key={y} p={[-5.94,y,w.z]} s={[.19,.075,w.width+.11]} c="#f4f1e9" r={.004}/>)}
  {[-1,0,1].map(n=><Box key={n} p={[-5.94,(w.sill+w.head)/2,w.z+n*w.width/2]} s={[.15,w.head-w.sill,.055]} c="#efede6" r={.003}/>)}
  <Box p={[-5.84,w.sill-.055,w.z]} s={[.37,.055,w.width+.2]} c="#ddd0b9" r={.008}/>
  <mesh position={[-5.7,2.46,w.z]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.015,.015,w.width+.45,12]}/><meshStandardMaterial color="#8b806d" roughness={.5}/></mesh>
  <Curtain z={w.z-w.width/2-.1} side={1}/><Curtain z={w.z+w.width/2+.1} side={-1}/>
 </group>)}
 {/* Lightweight geometry beyond the glass, not a full-screen background image. */}
 {[[-13,1.3,-7,3.5,2.6,4.4],[-17,2.3,0,4,4.6,4.5],[-14,1.7,7,3.5,3.4,4.3]].map(([x,y,z,w,h,d],i)=><group key={i}><Box p={[x,y,z]} s={[w,h,d]} c={i===1?'#c3c9c6':'#d5d6cd'} castShadow={false} r={.03}/>{[.8,1.7,2.6].filter(v=>v<h-.1).map(v=><Box key={v} p={[x+w/2+.01,v,z]} s={[.025,.32,d*.8]} c="#a7b7b8" r={.001} castShadow={false}/>)}</group>)}
 {[-7,-3,2,6].map((z,i)=><group key={z}><mesh position={[-9-i%2,.65,z]}><cylinderGeometry args={[.055,.07,1.3,8]}/><meshStandardMaterial color="#8c8972"/></mesh><mesh position={[-9-i%2,1.65,z]} scale={[.9,1.25,.9]}><sphereGeometry args={[.7,14,10]}/><meshStandardMaterial color={i%2?'#899b7a':'#9caa8e'} roughness={1}/></mesh></group>)}
 </group>}
export function Kitchen({lit}:{lit:boolean}){
 const worktop=useMemo(()=>{const s=new THREE.Shape();s.moveTo(-.9,-.38);s.lineTo(.9,-.38);s.lineTo(.9,.38);s.lineTo(-.9,.38);s.closePath();const hole=new THREE.Path();hole.moveTo(.05,-.19);hole.lineTo(.05,.19);hole.lineTo(.55,.19);hole.lineTo(.55,-.19);hole.closePath();s.holes.push(hole);return new THREE.ExtrudeGeometry(s,{depth:.045,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.006,bevelThickness:.004})},[]);
 const tap=useMemo(()=>new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(0,.19,0),new THREE.Vector3(0,.27,.07),new THREE.Vector3(0,.22,.16)]),[]);
 return <group>
 <Box p={[1.3,.44,.5]} s={[1.8,.86,.68]} c="#b8a188" r={.009}/><Box p={[1.3,.055,.47]} s={[1.7,.11,.55]} c="#766953" r={.004}/>
 {[.7,1.3,1.9].map(x=><group key={x}>
  <Box p={[x,.47,.852]} s={[.574,.78,.022]} c="#d8d3c5" r={.006}/><Box p={[x,.78,.877]} s={[.17,.014,.025]} c="#8b8271" r={.004}/>
  <Box p={[x,1.86,.24]} s={[.59,.62,.34]} c="#c8b092" r={.009}/><Box p={[x,1.86,.419]} s={[.565,.59,.018]} c="#dcd7ca" r={.005}/><Box p={[x,1.6,.437]} s={[.15,.012,.018]} c="#8f8678" r={.003}/>
 </group>)}
 <mesh position={[1.3,.922,.5]} rotation={[-Math.PI/2,0,0]} geometry={worktop} castShadow receiveShadow><meshStandardMaterial color="#e6e1d5" roughness={.46}/></mesh>
 <Box p={[1.6,.887,.5]} s={[.5,.012,.38]} c="#929d9b" r={.005}/>{[-1,1].map(n=><group key={n}><Box p={[1.6+n*.247,.909,.5]} s={[.012,.043,.38]} c="#aeb7b4" r={.003}/><Box p={[1.6,.909,.5+n*.185]} s={[.5,.043,.012]} c="#aeb7b4" r={.003}/></group>)}
 <mesh position={[1.6,.889,.5]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.024,16]}/><meshStandardMaterial color="#535f5c"/></mesh>
 <mesh position={[1.6,.963,.26]}><tubeGeometry args={[tap,20,.014,8,false]}/><meshStandardMaterial color="#a8b2ad" metalness={.75} roughness={.24}/></mesh>
 <Box p={[.79,.977,.5]} s={[.57,.018,.43]} c="#292e2e" r={.014}/>{[[-.14,-.09],[.14,.09]].map(([x,z],i)=><mesh key={i} rotation={[-Math.PI/2,0,0]} position={[.79+x,.988,.5+z]}><ringGeometry args={[.065,.069,32]}/><meshStandardMaterial color="#79817a" roughness={.5}/></mesh>)}
 <Box p={[.1,.95,.5]} s={[.6,1.9,.7]} c="#d7dbd5" r={.035}/><Box p={[.1,1.22,.864]} s={[.56,1.27,.025]} c="#e0e2dc" r={.014}/><Box p={[.1,.29,.864]} s={[.56,.51,.025]} c="#d8ddd7" r={.014}/><Box p={[.34,1.14,.892]} s={[.018,.35,.026]} c="#8c9690" r={.005}/><Box p={[.34,.36,.892]} s={[.018,.16,.026]} c="#8c9690" r={.005}/>
 <Box p={[2.02,1.04,.22]} s={[.22,.2,.03]} c="#b58c60" r={.035}/><Box p={[1.3,1.54,.36]} s={[1.7,.015,.03]} c={lit?'#f0dfb9':'#a39b86'} r={.002}/>
 {lit&&<pointLight position={[1.3,1.47,.6]} intensity={1.1} color="#ffe5b6" distance={2.5}/>}
 </group>;
}
export function RoomLights({lit,overview}:{lit:boolean;overview:boolean}){return <>{[[-3,-2.5],[3,-2.5]].map(([x,z],i)=><group key={i}>{!overview&&<mesh position={[x,2.665,z]}><cylinderGeometry args={[.2,.2,.055,24]}/><meshStandardMaterial color={lit?'#f6eddb':'#d5d3c8'} emissive={lit?'#ead5af':'#000000'} emissiveIntensity={.3} roughness={.7}/></mesh>}{lit&&<pointLight position={[x,2.43,z]} intensity={i===0?2:3} color="#fff0d5" distance={6.5}/>}</group>)}</>}
