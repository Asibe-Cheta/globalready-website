# Jobs SQL: Mobile vs Website Script — Correlation

The mobile team’s SQL and the website’s `JOBS_DATABASE_SETUP.sql` are **aligned in purpose and behavior**. Below is a direct comparison.

---

## 1. `in_demand_roles` table

| Aspect | Mobile team SQL | Website JOBS_DATABASE_SETUP.sql | Correlation |
|--------|------------------|----------------------------------|-------------|
| Table name | `in_demand_roles` | `public.in_demand_roles` | Same (Supabase defaults to `public`) |
| Primary key | `id UUID DEFAULT gen_random_uuid()` | `id UUID DEFAULT uuid_generate_v4()` | Same effect (both valid in Supabase) |
| Columns | rank, title, icon, accent_color, reason, is_active, created_at, updated_at | Same | Same |
| `reason` | `TEXT NOT NULL` | `TEXT` (nullable) | Mobile requires reason; website allows NULL. Admin UI sends reason; no conflict. |
| `accent_color` | `NOT NULL DEFAULT '#3b82f6'` | `DEFAULT '#3b82f6'` | Same default; mobile adds NOT NULL. |
| UNIQUE(rank) | Not present | Present | Website adds unique rank for upsertable seed. Optional; no conflict if mobile ran first. |
| RLS | Policy "Anyone can read active in_demand_roles" | "Public can view active in_demand_roles" | Same rule: `USING (is_active = true)`. |
| Index | `idx_in_demand_roles_rank` on (rank) | None | Mobile adds index; website can add it for consistency. |
| Seed | Single INSERT of 10 rows (no ON CONFLICT) | INSERT with ON CONFLICT (rank) DO UPDATE | Same 10 roles; mobile runs once, website script is re-runnable. Wording/colors differ slightly. |

**Verdict:** Same table shape and RLS. Website script can run after mobile’s (table already exists); only minor schema differences (reason nullable, UNIQUE(rank), index).

---

## 2. `jobs` table

| Aspect | Mobile team SQL | Website script | Correlation |
|--------|------------------|-----------------|-------------|
| Creation | Not created (assumed to exist) | `CREATE TABLE IF NOT EXISTS public.jobs` with full column set | Website can create if missing. |
| RLS policy | "Anyone can read active jobs" (created only if not exists) | "Public can view active jobs" (DROP IF EXISTS then CREATE) | Same rule: read only when `is_active = true`. |

**Verdict:** Compatible. Website script creates `jobs` if it doesn’t exist; policy logic matches.

---

## 3. `saved_jobs` table

| Aspect | Mobile team SQL | Website script | Correlation |
|--------|------------------|----------------|-------------|
| Creation | Not created (assumed to exist) | `CREATE TABLE IF NOT EXISTS public.saved_jobs` | Website can create if missing. |
| Policies | "Users can insert/read/delete **their** saved_jobs" (only if not exists) | "Users can insert/select/delete **own** saved_jobs" (DROP IF EXISTS then CREATE) | Same rule: user-scoped INSERT, SELECT, DELETE. |

**Verdict:** Compatible. Same behavior; only policy naming differs (“their” vs “own”).

---

## 4. RPCs (job counters)

| Function | Mobile | Website | Correlation |
|----------|--------|---------|-------------|
| `increment_job_views` | `(job_id UUID)` | `(job_uuid UUID)` | Same signature (UUID); param name irrelevant in Postgres. |
| `increment_job_applications` | `(job_id UUID)` | `(job_uuid UUID)` | Same. |
| Body | `UPDATE jobs SET view_count = COALESCE(view_count, 0) + 1 WHERE id = job_id` | Same (with `job_uuid`) | Identical. |
| SECURITY DEFINER | Yes | Yes | Same. |

**Verdict:** Equivalent. Either script can define or replace these functions.

---

## Summary

- **in_demand_roles:** Same columns and RLS; mobile uses `reason NOT NULL` and an index on `rank`; website uses nullable `reason` and optional `UNIQUE(rank)` for re-runnable seed.
- **jobs / saved_jobs:** Same RLS behavior; website script can create tables if missing.
- **RPCs:** Same behavior and safe to replace with either script.

**Conclusion:** The two scripts **correlate**. If the mobile team already ran their SQL, you do not need to run the website script for the same objects; policies and RPCs are compatible. Use the website script when you want to (a) ensure `jobs`/`saved_jobs` exist and (b) have a single, re-runnable migration that includes seed and RPCs.
