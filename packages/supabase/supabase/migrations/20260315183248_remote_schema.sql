drop extension if exists "pg_net";

create type "public"."notification_channel" as enum ('email', 'push');

create type "public"."notification_type" as enum ('new_companies');


  create table "public"."companies_snapshot" (
    "id" uuid not null default gen_random_uuid(),
    "slugs" text[] not null,
    "snapshot_date" timestamp with time zone not null default now()
      );


alter table "public"."companies_snapshot" enable row level security;


  create table "public"."notification_settings" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "channel" public.notification_channel not null,
    "type" public.notification_type not null,
    "enabled" boolean not null default true,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."notification_settings" enable row level security;


  create table "public"."users" (
    "id" uuid not null,
    "email" text not null,
    "full_name" text,
    "avatar_url" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX companies_snapshot_pkey ON public.companies_snapshot USING btree (id);

CREATE INDEX idx_companies_snapshot_snapshot_date ON public.companies_snapshot USING btree (snapshot_date DESC);

CREATE INDEX idx_notification_settings_type_channel_enabled ON public.notification_settings USING btree (type, channel, enabled) WHERE (enabled = true);

CREATE INDEX idx_notification_settings_user_id ON public.notification_settings USING btree (user_id);

CREATE UNIQUE INDEX notification_settings_pkey ON public.notification_settings USING btree (id);

CREATE UNIQUE INDEX notification_settings_user_id_channel_type_key ON public.notification_settings USING btree (user_id, channel, type);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."companies_snapshot" add constraint "companies_snapshot_pkey" PRIMARY KEY using index "companies_snapshot_pkey";

alter table "public"."notification_settings" add constraint "notification_settings_pkey" PRIMARY KEY using index "notification_settings_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."notification_settings" add constraint "notification_settings_user_id_channel_type_key" UNIQUE using index "notification_settings_user_id_channel_type_key";

alter table "public"."notification_settings" add constraint "notification_settings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."notification_settings" validate constraint "notification_settings_user_id_fkey";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    -- Insert user into public.users table
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    -- Insert default notification setting for new companies via email
    INSERT INTO public.notification_settings (user_id, channel, type, enabled)
    VALUES (
        NEW.id,
        'email',
        'new_companies',
        true
    );
    
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."companies_snapshot" to "anon";

grant insert on table "public"."companies_snapshot" to "anon";

grant references on table "public"."companies_snapshot" to "anon";

grant select on table "public"."companies_snapshot" to "anon";

grant trigger on table "public"."companies_snapshot" to "anon";

grant truncate on table "public"."companies_snapshot" to "anon";

grant update on table "public"."companies_snapshot" to "anon";

grant delete on table "public"."companies_snapshot" to "authenticated";

grant insert on table "public"."companies_snapshot" to "authenticated";

grant references on table "public"."companies_snapshot" to "authenticated";

grant select on table "public"."companies_snapshot" to "authenticated";

grant trigger on table "public"."companies_snapshot" to "authenticated";

grant truncate on table "public"."companies_snapshot" to "authenticated";

grant update on table "public"."companies_snapshot" to "authenticated";

grant delete on table "public"."companies_snapshot" to "service_role";

grant insert on table "public"."companies_snapshot" to "service_role";

grant references on table "public"."companies_snapshot" to "service_role";

grant select on table "public"."companies_snapshot" to "service_role";

grant trigger on table "public"."companies_snapshot" to "service_role";

grant truncate on table "public"."companies_snapshot" to "service_role";

grant update on table "public"."companies_snapshot" to "service_role";

grant delete on table "public"."notification_settings" to "anon";

grant insert on table "public"."notification_settings" to "anon";

grant references on table "public"."notification_settings" to "anon";

grant select on table "public"."notification_settings" to "anon";

grant trigger on table "public"."notification_settings" to "anon";

grant truncate on table "public"."notification_settings" to "anon";

grant update on table "public"."notification_settings" to "anon";

grant delete on table "public"."notification_settings" to "authenticated";

grant insert on table "public"."notification_settings" to "authenticated";

grant references on table "public"."notification_settings" to "authenticated";

grant select on table "public"."notification_settings" to "authenticated";

grant trigger on table "public"."notification_settings" to "authenticated";

grant truncate on table "public"."notification_settings" to "authenticated";

grant update on table "public"."notification_settings" to "authenticated";

grant delete on table "public"."notification_settings" to "service_role";

grant insert on table "public"."notification_settings" to "service_role";

grant references on table "public"."notification_settings" to "service_role";

grant select on table "public"."notification_settings" to "service_role";

grant trigger on table "public"."notification_settings" to "service_role";

grant truncate on table "public"."notification_settings" to "service_role";

grant update on table "public"."notification_settings" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";


  create policy "Allow service role full access to companies_snapshot"
  on "public"."companies_snapshot"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "Users can delete their own notification settings"
  on "public"."notification_settings"
  as permissive
  for delete
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can insert their own notification settings"
  on "public"."notification_settings"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can update their own notification settings"
  on "public"."notification_settings"
  as permissive
  for update
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can view their own notification settings"
  on "public"."notification_settings"
  as permissive
  for select
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can delete their own profile"
  on "public"."users"
  as permissive
  for delete
  to public
using ((( SELECT auth.uid() AS uid) = id));



  create policy "Users can insert their own profile"
  on "public"."users"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = id));



  create policy "Users can update their own profile"
  on "public"."users"
  as permissive
  for update
  to public
using ((( SELECT auth.uid() AS uid) = id))
with check ((( SELECT auth.uid() AS uid) = id));



  create policy "Users can view their own profile"
  on "public"."users"
  as permissive
  for select
  to public
using ((( SELECT auth.uid() AS uid) = id));


CREATE TRIGGER notification_settings_updated_at BEFORE UPDATE ON public.notification_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


  create policy "avatar_public_read"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'avatars'::text));



  create policy "avatar_user_delete"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'avatars'::text) AND (( SELECT (auth.uid())::text AS uid) = owner_id)));



  create policy "avatar_user_update"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'avatars'::text) AND (( SELECT (auth.uid())::text AS uid) = owner_id)))
with check (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid))));



  create policy "avatar_user_upload"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid))));



