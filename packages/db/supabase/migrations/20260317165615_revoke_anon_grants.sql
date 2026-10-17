-- Revoke all unnecessary anon permissions
revoke all on table "public"."users" from "anon";
revoke all on table "public"."notification_settings" from "anon";
revoke all on table "public"."companies_snapshot" from "anon";
