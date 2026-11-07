create type "public"."api_key_permission" as enum ('read', 'read_write');

create table "public"."api_keys" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "name" text not null,
  "key_prefix" text not null,
  "key_hash" text not null,
  "permission" public.api_key_permission not null default 'read',
  "rate_limit_per_minute" integer not null default 60,
  "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
  "last_used_at" timestamp with time zone,
  "expires_at" timestamp with time zone,
  "revoked_at" timestamp with time zone
);

alter table "public"."api_keys" enable row level security;

create unique index api_keys_pkey on public.api_keys using btree (id);
create unique index api_keys_key_hash_key on public.api_keys using btree (key_hash);
create index api_keys_user_id_idx on public.api_keys using btree (user_id);

alter table "public"."api_keys" add constraint "api_keys_pkey"
  primary key using index "api_keys_pkey";
alter table "public"."api_keys" add constraint "api_keys_key_hash_key"
  unique using index "api_keys_key_hash_key";
alter table "public"."api_keys" add constraint "api_keys_user_id_fkey"
  foreign key (user_id) references public.users(id) on delete cascade not valid;
alter table "public"."api_keys" validate constraint "api_keys_user_id_fkey";
alter table "public"."api_keys" add constraint "api_keys_name_check"
  check (char_length(btrim(name)) between 1 and 100);
alter table "public"."api_keys" add constraint "api_keys_key_prefix_check"
  check (char_length(key_prefix) between 8 and 32);
alter table "public"."api_keys" add constraint "api_keys_key_hash_check"
  check (key_hash ~ '^[0-9a-f]{64}$');
alter table "public"."api_keys" add constraint "api_keys_rate_limit_check"
  check (rate_limit_per_minute between 1 and 10000);

revoke all on table "public"."api_keys" from anon, authenticated;
grant select, insert, update, delete on table "public"."api_keys" to service_role;

create policy "Allow service role full access to API keys"
  on "public"."api_keys"
  as permissive
  for all
  to service_role
  using (true)
  with check (true);
