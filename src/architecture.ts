export const windowOpenings=[{id:'bedroom',z:-2.5,width:2.6,sill:.8,head:2.35},{id:'living',z:2.5,width:2.4,sill:.8,head:2.35}] as const;
/** Actual holes in the visual facade; the original outer collision wall stays closed. */
export function westWallPanels(){
 const panels:{z:number;y:number;length:number;height:number}[]=[];let edge=-5;
 for(const w of windowOpenings){const start=w.z-w.width/2,end=w.z+w.width/2;if(start>edge)panels.push({z:(edge+start)/2,y:1.35,length:start-edge,height:2.7});panels.push({z:w.z,y:w.sill/2,length:w.width,height:w.sill},{z:w.z,y:(w.head+2.7)/2,length:w.width,height:2.7-w.head});edge=end}
 if(edge<5)panels.push({z:(edge+5)/2,y:1.35,length:5-edge,height:2.7});return panels;
}
