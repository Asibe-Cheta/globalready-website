# Admin: Courses & Virtual Sessions (for mobile app)

Per the web app team spec, the admin panel has CRUD for **courses** (with path_category, icon, tint_color, display_order) and **virtual_sessions**. The mobile app reads from both tables; new/updated data appears in the app without an app update.

---

## Courses table

**Admin UI:** Courses → Add course / Edit course

**Fields (aligned with mobile):**
- **title**, **subtitle**, **description**
- **path_category** — one of: `side_hustle`, `tech_career`, `language`
- **icon** — MaterialIcons name (e.g. `code`, `security`, `cloud`)
- **tint_color** — hex (e.g. `#0d6cf2`)
- **display_order** — integer for sorting within category
- **syllabus** — JSONB (array of modules: title, description, icon, accent)
- **duration**, **level**, **is_active**, **featured**
- Legacy/optional: category, duration_hours, total_lessons, image_url, thumbnail_url, instructor, price, prerequisites, learning_outcomes, tags

**SQL:** Run `COURSES_AND_VIRTUAL_SESSIONS_SETUP.sql` to add `path_category`, `icon`, `tint_color`, `display_order` to `courses`. The full `admin_api_setup.sql` and `courses_add_duration_column.sql` also include these columns.

---

## virtual_sessions table

**Admin UI:** Virtual Sessions → list, Add session, Edit session

**Fields:**
- **course_id** (FK to courses) — required
- **session_date** (TIMESTAMPTZ) — date + time
- **timezone** (e.g. GMT)
- **location** (e.g. Virtual Room)
- **meeting_link** (optional — Zoom/Meet)
- **duration_minutes**, **is_active**

**SQL:** `COURSES_AND_VIRTUAL_SESSIONS_SETUP.sql` creates the `virtual_sessions` table and RLS (public read for active sessions).

---

## API

- **Courses:** `GET/POST /api/admin/courses`, `GET/PATCH/DELETE /api/admin/courses/:id` (unchanged; request body includes path_category, icon, tint_color, display_order).
- **Virtual sessions:** `GET /api/admin/virtual-sessions?course_id=&include_inactive=`, `GET/POST /api/admin/virtual-sessions`, `GET/PATCH/DELETE /api/admin/virtual-sessions/:id`.

Deploy the updated `admin-api` Edge Function after pulling so the new course fields and virtual-sessions routes are live.
