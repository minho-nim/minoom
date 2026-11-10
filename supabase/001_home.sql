-- Run once in a fresh Supabase project's SQL editor. No service key in browser.
create extension if not exists pgcrypto;
create table public.homes(id uuid primary key default gen_random_uuid(),owner_id uuid not null references auth.users(id),name text not null default '우리의 첫 번째 집',data jsonb not null,version bigint not null default 0,created_at timestamptz default now());
create table public.home_members(home_id uuid references public.homes(id) on delete cascade,user_id uuid references auth.users(id) on delete cascade,slot smallint not null check(slot in (1,2)),primary key(home_id,user_id),unique(home_id,slot),unique(user_id));
create table public.invitations(id uuid primary key default gen_random_uuid(),home_id uuid not null references public.homes(id) on delete cascade,token_hash bytea not null unique,expires_at timestamptz not null default now()+interval '24 hours',used_at timestamptz);
create function public.is_member(hid uuid) returns boolean language sql stable security definer set search_path=public,extensions as $$ select exists(select 1 from home_members where home_id=hid and user_id=auth.uid()) $$;
alter table public.homes enable row level security;
alter table public.home_members enable row level security;
alter table public.invitations enable row level security;
create policy home_read on public.homes for select to authenticated using(public.is_member(id));
create policy member_read on public.home_members for select to authenticated using(public.is_member(home_id));
-- Only security definer RPCs can write homes/membership/invites.
create function public.create_home(payload jsonb) returns uuid language plpgsql security definer set search_path=public,extensions as $$ declare h uuid;begin
 if auth.uid() is null then raise exception '로그인이 필요합니다';end if;
 if exists(select 1 from home_members where user_id=auth.uid()) then raise exception '이미 연결된 집이 있습니다';end if;
 if jsonb_typeof(payload) <> 'object' or octet_length(payload::text)>2000000 then raise exception '잘못된 집 데이터';end if;
 insert into homes(owner_id,data) values(auth.uid(),payload) returning id into h;
 insert into home_members values(h,auth.uid(),1);return h;end $$;
create function public.create_invite(hid uuid) returns text language plpgsql security definer set search_path=public,extensions as $$ declare t text;begin
 perform 1 from homes where id=hid and owner_id=auth.uid() for update;
 if not found then raise exception '집 소유자만 초대할 수 있습니다';end if;
 if (select count(*) from home_members where home_id=hid)>=2 then raise exception '이미 두 명이 살고 있습니다';end if;
 delete from invitations where home_id=hid;
 t=encode(gen_random_bytes(24),'hex');insert into invitations(home_id,token_hash) values(hid,digest(t,'sha256'));return t;end $$;
create function public.accept_invite(token text) returns uuid language plpgsql security definer set search_path=public,extensions as $$ declare inv invitations;begin
 if auth.uid() is null then raise exception '로그인이 필요합니다';end if;
 select * into inv from invitations where token_hash=digest(token,'sha256') for update;
 if inv.id is null or inv.used_at is not null or inv.expires_at<now() then raise exception '만료되었거나 사용된 초대입니다';end if;
 perform 1 from homes where id=inv.home_id for update;
 if (select count(*) from home_members where home_id=inv.home_id)>=2 then raise exception '집이 가득 찼습니다';end if;
 insert into home_members values(inv.home_id,auth.uid(),2);
 update invitations set used_at=now() where id=inv.id;return inv.home_id;end $$;
create function public.save_home(hid uuid,expected bigint,payload jsonb) returns bigint language plpgsql security definer set search_path=public,extensions as $$ declare v bigint;begin
 if not public.is_member(hid) then raise exception '접근 권한이 없습니다';end if;
 if jsonb_typeof(payload) <> 'object' or octet_length(payload::text)>2000000 then raise exception '잘못된 집 데이터';end if;
 update homes set data=payload,version=version+1 where id=hid and version=expected returning version into v;
 if v is null then raise exception '다른 사용자가 변경했습니다. 최신 상태를 다시 불러오세요.';end if;return v;end $$;
revoke all on function public.create_home(jsonb),public.create_invite(uuid),public.accept_invite(text),public.save_home(uuid,bigint,jsonb) from public,anon;
grant execute on function public.create_home(jsonb),public.create_invite(uuid),public.accept_invite(text),public.save_home(uuid,bigint,jsonb) to authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('furniture','furniture',false,15728640,array['image/jpeg','image/png','image/webp','model/gltf-binary','application/octet-stream']);
create policy asset_read on storage.objects for select to authenticated using(bucket_id='furniture' and public.is_member((storage.foldername(name))[1]::uuid));
create policy asset_insert on storage.objects for insert to authenticated with check(bucket_id='furniture' and public.is_member((storage.foldername(name))[1]::uuid));
create policy asset_delete on storage.objects for delete to authenticated using(bucket_id='furniture' and public.is_member((storage.foldername(name))[1]::uuid));
-- Private Presence / Broadcast authorization. Channel topic contains only a home UUID.
create policy realtime_read on realtime.messages for select to authenticated using(public.is_member(split_part(realtime.topic(),':',2)::uuid));
create policy realtime_send on realtime.messages for insert to authenticated with check(public.is_member(split_part(realtime.topic(),':',2)::uuid));
alter publication supabase_realtime add table public.homes;
