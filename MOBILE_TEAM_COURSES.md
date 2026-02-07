# Course data for the mobile app

This file is for the mobile team. It explains where course data comes from and how it stays in sync with the admin website.

## Source of truth

- **Same API:** Course data is served from the **Supabase Admin API** (`/courses` and `/courses/:id`).  
  See `ADMIN_API_DOCS.md` in this repo for full endpoint details (GET/POST/PUT/PATCH/DELETE, request/response shapes, and the course fields reference).

- **Admin website:** The website’s admin dashboard (add/edit courses) talks to that same Admin API through a proxy. So:
  - Courses created or updated in the admin dashboard are written to the same Supabase tables.
  - The mobile app should read courses from the **Admin API** (with `x-admin-key` or your Supabase service role). That way, the app always sees the same data the admin just added or edited.

## Summary

| What | Where |
|------|--------|
| **API for courses** | Admin API: `GET/POST/PUT/PATCH/DELETE` on `/courses` and `/courses/:id` |
| **Auth for API** | `x-admin-key` header (or Supabase service role); no website login/session |
| **Admin UI** | Website admin dashboard → proxy → same Admin API → same Supabase data |
| **Mobile app** | Call Admin API directly; same data as admin dashboard |

For field names, types, and defaults, use the “Course Fields Reference” table in `ADMIN_API_DOCS.md`.
