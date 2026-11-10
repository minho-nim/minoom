/** One pointer owns a look gesture; hover and unrelated fingers never rotate the camera. */
export class LookDrag {
 private point:{id:number;x:number;y:number}|null=null;
 start(id:number,x:number,y:number){if(this.point)return false;this.point={id,x,y};return true}
 move(id:number,x:number,y:number):[number,number]{if(!this.point||this.point.id!==id)return [0,0];const delta:[number,number]=[x-this.point.x,y-this.point.y];this.point={id,x,y};return delta}
 end(id?:number){if(id===undefined||this.point?.id===id)this.point=null}
 get active(){return this.point!==null}
}
