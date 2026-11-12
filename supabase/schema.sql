-- =========================================================
-- 不動産管理アプリ用 物件テーブル
-- Supabase ダッシュボードの SQL Editor に貼り付けて実行する
-- =========================================================

-- 物件テーブル
create table if not exists public.properties (
  id         uuid primary key default gen_random_uuid(),
  -- 登録したユーザー。INSERT 時に省略するとログイン中のユーザー ID が入る
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 100),   -- 物件名
  rent       integer not null check (rent >= 0),                           -- 家賃(円/月)
  area       text not null check (char_length(area) between 1 and 100),   -- エリア名
  layout     text not null check (char_length(layout) between 1 and 20),  -- 間取り(例:1LDK)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ユーザーごとの一覧取得を速くするためのインデックス
create index if not exists properties_user_id_idx on public.properties (user_id);

-- 更新時に updated_at を自動で現在時刻にする
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- RLS(行レベルセキュリティ)
-- 自分が登録した物件だけを表示・登録・編集・削除できるようにする
-- ---------------------------------------------------------
alter table public.properties enable row level security;

-- ログイン中のユーザーにだけテーブル操作を許可する(未ログインの anon には許可しない)
revoke all on public.properties from anon;
grant select, insert, update, delete on public.properties to authenticated;

-- 表示:自分の物件のみ
drop policy if exists "自分の物件のみ表示" on public.properties;
create policy "自分の物件のみ表示"
  on public.properties for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- 登録:user_id が自分のものだけ登録できる(他人名義での登録を防ぐ)
drop policy if exists "自分の物件のみ登録" on public.properties;
create policy "自分の物件のみ登録"
  on public.properties for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- 編集:自分の物件のみ。編集後も user_id は自分のままでなければならない
drop policy if exists "自分の物件のみ編集" on public.properties;
create policy "自分の物件のみ編集"
  on public.properties for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 削除:自分の物件のみ
drop policy if exists "自分の物件のみ削除" on public.properties;
create policy "自分の物件のみ削除"
  on public.properties for delete
  to authenticated
  using ((select auth.uid()) = user_id);
