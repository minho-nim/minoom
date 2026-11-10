import {createClient,type RealtimeChannel} from '@supabase/supabase-js';
import type {HomeData} from './domain';
const env=(import.meta as unknown as {env:Record<string,string>}).env;
export const supabase=env.VITE_SUPABASE_URL&&env.VITE_SUPABASE_ANON_KEY?createClient(env.VITE_SUPABASE_URL,env.VITE_SUPABASE_ANON_KEY):null;
export type Peer={id:string;x:number;z:number;yaw:number;action:string;emotion:string;seat:string;avatar?:'A'|'B'};
export class HomeConnection {
 peer:Peer|null=null;channel:RealtimeChannel|null=null;avatar:'A'|'B'='A';version=0;homeId='';uid='';onPeer:(p:Peer|null)=>void=()=>{};onData:(d:HomeData)=>void=()=>{};onStatus:(s:string)=>void=()=>{};
 async open(homeId:string){if(!supabase)return;this.homeId=homeId;this.uid=(await supabase.auth.getUser()).data.user?.id||'';const {data,error}=await supabase.from('homes').select('data,version').eq('id',homeId).single();if(error)throw error;this.version=data.version;const member=await supabase.from('home_members').select('slot').eq('home_id',homeId).eq('user_id',this.uid).single();this.avatar=member.data?.slot===2?'B':'A';this.onData(data.data);this.channel=supabase.channel(`home:${homeId}`,{config:{private:true,presence:{key:this.uid}}});this.channel.on('broadcast',{event:'move'},({payload})=>{if(payload.id!==this.uid){this.peer=payload;this.onPeer(payload)}}).on('presence',{event:'sync'},()=>{if(Object.keys(this.channel!.presenceState()).filter(k=>k!==this.uid).length===0){this.peer=null;this.onPeer(null)}}).on('postgres_changes',{event:'UPDATE',schema:'public',table:'homes',filter:`id=eq.${homeId}`},p=>{this.version=p.new.version;this.onData(p.new.data)}).subscribe(async status=>{this.onStatus(status);if(status==='SUBSCRIBED')await this.channel!.track({online:true})}); }
 send(p:Omit<Peer,'id'>){this.channel?.send({type:'broadcast',event:'move',payload:{...p,id:this.uid,avatar:this.avatar}})}
 async save(data:HomeData){if(!supabase)return;const {data:result,error}=await supabase.rpc('save_home',{hid:this.homeId,expected:this.version,payload:data});if(error)throw error;this.version=result;}
 async asset(file:File){if(!supabase)throw Error('온라인 연결이 필요합니다');const path=`${this.homeId}/${crypto.randomUUID()}.${file.name.split('.').pop()}`;const {error}=await supabase.storage.from('furniture').upload(path,file);if(error)throw error;return 'storage:'+path;}
 close(){if(this.channel)supabase?.removeChannel(this.channel);this.channel=null;this.peer=null;this.onPeer(null)}
}
export const connection=new HomeConnection();
export async function assetUrl(path:string){if(!path.startsWith('storage:'))return path;const {data,error}=await supabase!.storage.from('furniture').createSignedUrl(path.slice(8),3600);if(error)throw error;return data.signedUrl;}
