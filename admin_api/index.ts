// Supabase Edge Function (Deno) — excluded from Next.js build. Deploy: supabase functions deploy admin-api
// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-key',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message }, status);
}

/** Verify the request has a valid admin key or service role key */
function verifyAdmin(req: Request): boolean {
  const adminKey = Deno.env.get('ADMIN_API_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  const providedKey =
    req.headers.get('x-admin-key') ||
    req.headers.get('authorization')?.replace('Bearer ', '');

  if (!providedKey) return false;

  // Accept either the dedicated admin key or the service role key
  if (adminKey && providedKey === adminKey) return true;
  if (serviceRoleKey && providedKey === serviceRoleKey) return true;

  return false;
}

function getSupabase() {
  const url = Deno.env.get('SUPABASE_URL')!;
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(url, key);
}

// ============================================================
// Route handlers
// ============================================================

// --- COURSES ---

async function getCourses(url: URL) {
  const supabase = getSupabase();
  const category = url.searchParams.get('category');
  const includeInactive = url.searchParams.get('include_inactive') === 'true';
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = (page - 1) * limit;

  let query = supabase
    .from('courses')
    .select('*, course_registrations(count)', { count: 'exact' });

  if (!includeInactive) {
    query = query.eq('is_active', true);
  }
  if (category) {
    query = query.eq('category', category);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return errorResponse(error.message, 500);

  return jsonResponse({
    courses: data,
    pagination: { page, limit, total: count || 0 },
  });
}

async function getCourseById(id: string) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('courses')
    .select('*, course_registrations(id, full_name, email, phone, status, created_at)')
    .eq('id', id)
    .single();

  if (error) return errorResponse(error.message, error.code === 'PGRST116' ? 404 : 500);

  return jsonResponse(data);
}

async function createCourse(body: any) {
  const supabase = getSupabase();

  const {
    title, subtitle, description, category, duration, duration_hours,
    total_lessons, image_url, thumbnail_url, instructor, instructor_avatar,
    price, currency, level, syllabus, prerequisites, learning_outcomes,
    tags, featured, is_active,
  } = body;

  if (!title) return errorResponse('Title is required');

  const { data, error } = await supabase
    .from('courses')
    .insert({
      title,
      subtitle: subtitle || null,
      description: description || null,
      category: category || null,
      duration: duration || null,
      duration_hours: duration_hours || 0,
      total_lessons: total_lessons || 0,
      image_url: image_url || null,
      thumbnail_url: thumbnail_url || null,
      instructor: instructor || null,
      instructor_avatar: instructor_avatar || null,
      price: price || 0,
      currency: currency || 'USD',
      level: level || 'beginner',
      syllabus: syllabus || [],
      prerequisites: prerequisites || [],
      learning_outcomes: learning_outcomes || [],
      tags: tags || [],
      featured: featured || false,
      is_active: is_active !== false,
    })
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  return jsonResponse(data, 201);
}

async function updateCourse(id: string, body: any) {
  const supabase = getSupabase();

  // Only include fields that are actually provided
  const updates: Record<string, any> = {};
  const fields = [
    'title', 'subtitle', 'description', 'category', 'duration', 'duration_hours',
    'total_lessons', 'image_url', 'thumbnail_url', 'instructor', 'instructor_avatar',
    'price', 'currency', 'level', 'syllabus', 'prerequisites', 'learning_outcomes',
    'tags', 'featured', 'is_active',
  ];

  for (const field of fields) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return errorResponse('No fields to update');
  }

  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  return jsonResponse(data);
}

async function deleteCourse(id: string) {
  const supabase = getSupabase();

  // Soft delete — just set is_active = false
  const { data, error } = await supabase
    .from('courses')
    .update({ is_active: false })
    .eq('id', id)
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  return jsonResponse({ success: true, course: data });
}

// --- DASHBOARD ---

async function getDashboardStats() {
  const supabase = getSupabase();

  const { data, error } = await supabase.rpc('admin_dashboard_stats');
  if (error) return errorResponse(error.message, 500);

  return jsonResponse(data);
}

async function getRevenueOverTime(url: URL) {
  const supabase = getSupabase();
  const days = parseInt(url.searchParams.get('days') || '30');

  const { data, error } = await supabase.rpc('admin_revenue_over_time', { days_back: days });
  if (error) return errorResponse(error.message, 500);

  return jsonResponse(data || []);
}

async function getSkillsInsights() {
  const supabase = getSupabase();

  const { data, error } = await supabase.rpc('admin_skills_insights');
  if (error) return errorResponse(error.message, 500);

  return jsonResponse(data);
}

async function getUserGrowth(url: URL) {
  const supabase = getSupabase();
  const days = parseInt(url.searchParams.get('days') || '30');

  const { data, error } = await supabase.rpc('admin_user_growth', { days_back: days });
  if (error) return errorResponse(error.message, 500);

  return jsonResponse(data || []);
}

// --- USERS ---

async function getUsers(url: URL) {
  const supabase = getSupabase();
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = (page - 1) * limit;
  const search = url.searchParams.get('search');

  let query = supabase
    .from('profiles')
    .select('id, full_name, email, phone, country, avatar_url, created_at, updated_at', { count: 'exact' });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data: profiles, error: profilesError, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (profilesError) return errorResponse(profilesError.message, 500);

  // Enrich with CV count and payment info
  const userIds = (profiles || []).map((p: any) => p.id);

  const [cvsResult, paymentsResult, registrationsResult] = await Promise.all([
    supabase
      .from('cvs')
      .select('user_id')
      .in('user_id', userIds),
    supabase
      .from('payments')
      .select('user_id, amount, status')
      .in('user_id', userIds)
      .eq('status', 'successful'),
    supabase
      .from('course_registrations')
      .select('user_id')
      .in('user_id', userIds),
  ]);

  const cvCounts: Record<string, number> = {};
  const paymentTotals: Record<string, number> = {};
  const registrationCounts: Record<string, number> = {};

  for (const cv of cvsResult.data || []) {
    cvCounts[cv.user_id] = (cvCounts[cv.user_id] || 0) + 1;
  }
  for (const p of paymentsResult.data || []) {
    paymentTotals[p.user_id] = (paymentTotals[p.user_id] || 0) + p.amount;
  }
  for (const r of registrationsResult.data || []) {
    registrationCounts[r.user_id] = (registrationCounts[r.user_id] || 0) + 1;
  }

  const enrichedUsers = (profiles || []).map((user: any) => ({
    ...user,
    cv_count: cvCounts[user.id] || 0,
    total_spent: paymentTotals[user.id] || 0,
    course_registrations: registrationCounts[user.id] || 0,
  }));

  return jsonResponse({
    users: enrichedUsers,
    pagination: { page, limit, total: count || 0 },
  });
}

async function getUserById(id: string) {
  const supabase = getSupabase();

  const [profileResult, cvsResult, paymentsResult, registrationsResult, assessmentResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', id).single(),
    supabase.from('cvs').select('id, type, payment_status, created_at').eq('user_id', id).order('created_at', { ascending: false }),
    supabase.from('payments').select('*').eq('user_id', id).order('created_at', { ascending: false }),
    supabase.from('course_registrations').select('*, courses(title, category)').eq('user_id', id).order('created_at', { ascending: false }),
    supabase.from('assessments').select('*').eq('user_id', id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
  ]);

  if (profileResult.error) return errorResponse(profileResult.error.message, 404);

  return jsonResponse({
    profile: profileResult.data,
    cvs: cvsResult.data || [],
    payments: paymentsResult.data || [],
    registrations: registrationsResult.data || [],
    assessment: assessmentResult.data,
  });
}

// --- PAYMENTS ---

async function getPayments(url: URL) {
  const supabase = getSupabase();
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = (page - 1) * limit;
  const status = url.searchParams.get('status');

  let query = supabase
    .from('payments')
    .select('*, profiles:user_id(full_name, email)', { count: 'exact' });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return errorResponse(error.message, 500);

  return jsonResponse({
    payments: data,
    pagination: { page, limit, total: count || 0 },
  });
}

// --- REGISTRATIONS ---

async function getRegistrations(url: URL) {
  const supabase = getSupabase();
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = (page - 1) * limit;
  const courseId = url.searchParams.get('course_id');

  let query = supabase
    .from('course_registrations')
    .select('*, courses(title, category)', { count: 'exact' });

  if (courseId) {
    query = query.eq('course_id', courseId);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return errorResponse(error.message, 500);

  return jsonResponse({
    registrations: data,
    pagination: { page, limit, total: count || 0 },
  });
}

async function updateRegistrationStatus(id: string, body: any) {
  const supabase = getSupabase();
  const { status, completed_at } = body;

  const updates: Record<string, any> = {};
  if (status) updates.status = status;
  if (completed_at) updates.completed_at = completed_at;
  if (status === 'completed' && !completed_at) updates.completed_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('course_registrations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);

  return jsonResponse(data);
}

// --- JOBS ---

async function getJobs(url: URL) {
  const supabase = getSupabase();
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = (page - 1) * limit;
  const country = url.searchParams.get('country');
  const sector = url.searchParams.get('sector');
  const search = url.searchParams.get('search');
  const includeInactive = url.searchParams.get('include_inactive') === 'true';

  let query = supabase.from('jobs').select('*', { count: 'exact' });

  if (!includeInactive) query = query.eq('is_active', true);
  if (country) query = query.eq('country', country);
  if (sector) query = query.eq('sector', sector);
  if (search && search.trim()) {
    query = query.or(`title.ilike.%${search.trim()}%,company.ilike.%${search.trim()}%`);
  }

  const { data, error, count } = await query
    .order('is_featured', { ascending: false })
    .order('posted_date', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (error) return errorResponse(error.message, 500);

  return jsonResponse({
    jobs: data,
    pagination: { page, limit, total: count || 0 },
  });
}

async function getJobById(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
  if (error) return errorResponse(error.message, error.code === 'PGRST116' ? 404 : 500);
  return jsonResponse(data);
}

async function createJob(body: any) {
  const supabase = getSupabase();
  const { title, company, country, city, job_type, sector, visa_sponsorship, salary_range, description, apply_url, posted_date, expires_at, is_active, is_featured, requirements } = body;
  if (!title) return errorResponse('Title is required');
  if (!company) return errorResponse('Company is required');

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      title,
      company,
      country: country || null,
      city: city || null,
      job_type: job_type || null,
      sector: sector || null,
      visa_sponsorship: visa_sponsorship || null,
      salary_range: salary_range || null,
      description: description || null,
      apply_url: apply_url || null,
      posted_date: posted_date || new Date().toISOString(),
      expires_at: expires_at || null,
      is_active: is_active !== false,
      is_featured: is_featured || false,
      requirements: requirements || {},
    })
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);
  return jsonResponse(data, 201);
}

async function updateJob(id: string, body: any) {
  const supabase = getSupabase();
  const fields = ['title', 'company', 'country', 'city', 'job_type', 'sector', 'visa_sponsorship', 'salary_range', 'description', 'apply_url', 'posted_date', 'expires_at', 'is_active', 'is_featured', 'requirements'];
  const updates: Record<string, any> = {};
  for (const field of fields) {
    if (body[field] !== undefined) updates[field] = body[field];
  }
  if (Object.keys(updates).length === 0) return errorResponse('No fields to update');

  const { data, error } = await supabase.from('jobs').update(updates).eq('id', id).select().single();
  if (error) return errorResponse(error.message, 500);
  return jsonResponse(data);
}

async function deleteJob(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('jobs').update({ is_active: false }).eq('id', id);
  if (error) return errorResponse(error.message, 500);
  return jsonResponse({ success: true });
}

// --- IN-DEMAND ROLES ---

async function getInDemandRoles(url: URL) {
  const supabase = getSupabase();
  const includeInactive = url.searchParams.get('include_inactive') === 'true';
  let query = supabase.from('in_demand_roles').select('*').order('rank', { ascending: true });
  if (!includeInactive) query = query.eq('is_active', true);
  const { data, error } = await query;
  if (error) return errorResponse(error.message, 500);
  return jsonResponse({ roles: data });
}

async function getInDemandRoleById(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('in_demand_roles').select('*').eq('id', id).single();
  if (error) return errorResponse(error.message, error.code === 'PGRST116' ? 404 : 500);
  return jsonResponse(data);
}

async function createInDemandRole(body: any) {
  const supabase = getSupabase();
  const { rank, title, icon, accent_color, reason, is_active } = body;
  if (rank === undefined || rank === null) return errorResponse('Rank is required');
  if (!title) return errorResponse('Title is required');

  const { data, error } = await supabase
    .from('in_demand_roles')
    .insert({
      rank: parseInt(String(rank), 10),
      title,
      icon: icon || 'code',
      accent_color: accent_color || '#3b82f6',
      reason: reason || null,
      is_active: is_active !== false,
    })
    .select()
    .single();

  if (error) return errorResponse(error.message, 500);
  return jsonResponse(data, 201);
}

async function updateInDemandRole(id: string, body: any) {
  const supabase = getSupabase();
  const fields = ['rank', 'title', 'icon', 'accent_color', 'reason', 'is_active'];
  const updates: Record<string, any> = {};
  for (const field of fields) {
    if (body[field] !== undefined) updates[field] = body[field];
  }
  if (updates.rank !== undefined) updates.rank = parseInt(String(updates.rank), 10);
  if (Object.keys(updates).length === 0) return errorResponse('No fields to update');

  const { data, error } = await supabase.from('in_demand_roles').update(updates).eq('id', id).select().single();
  if (error) return errorResponse(error.message, 500);
  return jsonResponse(data);
}

async function deleteInDemandRole(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('in_demand_roles').update({ is_active: false }).eq('id', id);
  if (error) return errorResponse(error.message, 500);
  return jsonResponse({ success: true });
}

// --- SETTINGS ---

async function getSettings() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('admin_settings')
    .select('key, value')
    .in('key', ['admin_emails']);
  if (error) return errorResponse(error.message, 500);
  const adminEmails = (data?.find((r) => r.key === 'admin_emails')?.value as string[] | null) || [];
  return jsonResponse({ admin_emails: adminEmails });
}

async function updateSettings(body: { admin_emails?: string[] }) {
  const emails = body.admin_emails;
  if (!Array.isArray(emails)) return errorResponse('admin_emails must be an array of strings', 400);
  const valid = emails.every((e) => typeof e === 'string' && e.includes('@'));
  if (!valid) return errorResponse('Each admin_emails entry must be a valid email string', 400);
  const supabase = getSupabase();
  const { error } = await supabase
    .from('admin_settings')
    .upsert({ key: 'admin_emails', value: emails, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) return errorResponse(error.message, 500);
  return jsonResponse({ admin_emails: emails });
}

// --- ASSESSMENTS ---

async function getAssessments(url: URL) {
  const supabase = getSupabase();
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = (page - 1) * limit;
  const status = url.searchParams.get('status');

  let query = supabase
    .from('assessments')
    .select('id, user_id, target_country, job_sector, current_status, years_experience, education_level, match_score, eligibility_status, status, created_at, profiles:user_id(full_name, email)', { count: 'exact' });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return errorResponse(error.message, 500);

  return jsonResponse({
    assessments: data,
    pagination: { page, limit, total: count || 0 },
  });
}

// ============================================================
// Router
// ============================================================

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Verify admin authentication
  if (!verifyAdmin(req)) {
    return errorResponse('Unauthorized. Provide a valid x-admin-key header.', 401);
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/admin-api\/?/, '').replace(/\/$/, '');
  const method = req.method;

  try {
    let body: any = {};
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      body = await req.json().catch(() => ({}));
    }

    // --- COURSES ---
    if (path === 'courses' && method === 'GET') {
      return getCourses(url);
    }
    if (path.match(/^courses\/[a-f0-9-]+$/) && method === 'GET') {
      const id = path.split('/')[1];
      return getCourseById(id);
    }
    if (path === 'courses' && method === 'POST') {
      return createCourse(body);
    }
    if (path.match(/^courses\/[a-f0-9-]+$/) && (method === 'PUT' || method === 'PATCH')) {
      const id = path.split('/')[1];
      return updateCourse(id, body);
    }
    if (path.match(/^courses\/[a-f0-9-]+$/) && method === 'DELETE') {
      const id = path.split('/')[1];
      return deleteCourse(id);
    }

    // --- DASHBOARD ---
    if (path === 'dashboard/stats' && method === 'GET') {
      return getDashboardStats();
    }
    if (path === 'dashboard/revenue' && method === 'GET') {
      return getRevenueOverTime(url);
    }
    if (path === 'dashboard/skills' && method === 'GET') {
      return getSkillsInsights();
    }
    if (path === 'dashboard/user-growth' && method === 'GET') {
      return getUserGrowth(url);
    }

    // --- USERS ---
    if (path === 'users' && method === 'GET') {
      return getUsers(url);
    }
    if (path.match(/^users\/[a-f0-9-]+$/) && method === 'GET') {
      const id = path.split('/')[1];
      return getUserById(id);
    }

    // --- PAYMENTS ---
    if (path === 'payments' && method === 'GET') {
      return getPayments(url);
    }

    // --- REGISTRATIONS ---
    if (path === 'registrations' && method === 'GET') {
      return getRegistrations(url);
    }
    if (path.match(/^registrations\/[a-f0-9-]+$/) && (method === 'PUT' || method === 'PATCH')) {
      const id = path.split('/')[1];
      return updateRegistrationStatus(id, body);
    }

    // --- ASSESSMENTS ---
    if (path === 'assessments' && method === 'GET') {
      return getAssessments(url);
    }

    // --- SETTINGS ---
    if (path === 'settings' && method === 'GET') {
      return getSettings();
    }
    if (path === 'settings' && (method === 'PATCH' || method === 'PUT')) {
      return updateSettings(body);
    }

    // --- JOBS ---
    if (path === 'jobs' && method === 'GET') {
      return getJobs(url);
    }
    if (path.match(/^jobs\/[a-f0-9-]+$/) && method === 'GET') {
      return getJobById(path.split('/')[1]);
    }
    if (path === 'jobs' && method === 'POST') {
      return createJob(body);
    }
    if (path.match(/^jobs\/[a-f0-9-]+$/) && (method === 'PUT' || method === 'PATCH')) {
      return updateJob(path.split('/')[1], body);
    }
    if (path.match(/^jobs\/[a-f0-9-]+$/) && method === 'DELETE') {
      return deleteJob(path.split('/')[1]);
    }

    // --- IN-DEMAND ROLES ---
    if (path === 'in-demand-roles' && method === 'GET') {
      return getInDemandRoles(url);
    }
    if (path.match(/^in-demand-roles\/[a-f0-9-]+$/) && method === 'GET') {
      return getInDemandRoleById(path.split('/')[1]);
    }
    if (path === 'in-demand-roles' && method === 'POST') {
      return createInDemandRole(body);
    }
    if (path.match(/^in-demand-roles\/[a-f0-9-]+$/) && (method === 'PUT' || method === 'PATCH')) {
      return updateInDemandRole(path.split('/')[1], body);
    }
    if (path.match(/^in-demand-roles\/[a-f0-9-]+$/) && method === 'DELETE') {
      return deleteInDemandRole(path.split('/')[1]);
    }

    return errorResponse(`Route not found: ${method} /${path}`, 404);
  } catch (error: any) {
    console.error('Admin API error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
});
