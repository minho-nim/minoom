export function canConsumeScroll(position:number,content:number,viewport:number,fingerDelta:number){return content>viewport+1&&(fingerDelta>0?position>1:fingerDelta<0?position+viewport<content-1:false)}
export class VirtualJoystick {
 private origin:{id:number;x:number;y:number}|null=null;
 start(id:number,x:number,y:number){if(this.origin)return false;this.origin={id,x,y};return true}
 move(id:number,x:number,y:number):[number,number]|null {if(this.origin?.id!==id)return null;let dx=(x-this.origin.x)/35,dz=(y-this.origin.y)/35;const length=Math.hypot(dx,dz);if(length<.08)return [0,0];if(length>1){dx/=length;dz/=length}return [dx,dz]}
 end(id?:number){if(id!==undefined&&this.origin?.id!==id)return false;this.origin=null;return true}
}

export function isMouseFpsClick(pointerType:string|undefined,canHover:boolean){return canHover&&(!pointerType||pointerType==='mouse')}
