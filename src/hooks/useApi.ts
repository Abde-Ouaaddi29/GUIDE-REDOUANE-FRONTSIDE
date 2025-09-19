import { useState } from 'react';
import { URL_SERVER } from '../app/constants';

const API_BASE = `${URL_SERVER}/api/v1`;

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');
const authHeader = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : undefined;
};

// Helper to merge Content-Type and Authorization headers safely
const jsonAuthHeaders = () => {
  const auth = authHeader();
  return auth ? { 'Content-Type': 'application/json', ...auth } : { 'Content-Type': 'application/json' };
};

// (Optional) minimal type placeholders
interface ApiResponse { message?: string; [k: string]: any }
interface ReservationData {
  name: string; email: string; phone: string; country: string;
  selectedService: number; date: string; guests: number; message?: string;
}
interface ReservationRecord {
  id:number; country:string; date_reservation:string; email:string; full_name:string; guests:number; note?:string|null; phone:string; status:string; service_id:number; created_at?:string; updated_at?:string;
}
interface ExperienceData { id?:number; city:string; place:string; img1?:any; img2?:any; img3?:any; img4?:any }
interface ServiceType { id?:number; typeName:string; description?:string }
interface ServiceContent { id?:number; serviceName:string; description?:string; duration?:string; price?:number; imageBase64?:string; servicesTypeId?:number; serviceTypeName?:string; serviceType?: { id:number; typeName:string } }
interface ServiceQuery { page?:number; perPage?:number; q?:string; servicesTypeId?:number; minPrice?:number; maxPrice?:number }
interface Paginated<T> { data:T[]; current_page:number; last_page:number; per_page:number; total:number; [k:string]:any }
interface AuthUser { id:number; email?:string; username?:string; city?:string; country?:string; phone?:number|string|null; description1?:string; description2?:string; description3?:string; description4?:string; logo_url?:string|null; image_url1?:string|null; image_url2?:string|null; image_url3?:string|null; image_url4?:string|null; image_url5?:string|null }

// Feedback payload expected by createFeedback
export interface FeedbackData { fullName:string; email:string; subject:string; message:string }

const transformExperienceData = (list:any[]) => list; // adjust if needed

export const useApi = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  // -------- Reservations ----------
  const postReservation = async (reservationData: ReservationData): Promise<ApiResponse> => {
    setLoading(true); setError(null); setData(null);
    try {
      const body = {
  full_name: reservationData.name,
  email: reservationData.email,
        phone: reservationData.phone,
        country: reservationData.country,
        service_id: reservationData.selectedService,
        date_reservation: reservationData.date, // backend expects date only per migration
        guests: reservationData.guests,
        note: reservationData.message,
      };
      const resp = await fetch(`${API_BASE}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept':'application/json' },
        body: JSON.stringify(body),
        redirect: 'manual', // prevent auto-follow of unexpected redirects masking CORS
      });
      const text = await resp.text();
      let json: ApiResponse = {};
      try { json = text ? JSON.parse(text) : {}; } catch { /* not JSON */ }
      if (!resp.ok) {
        // Collect first validation error if present
        if (json.errors) {
          const firstKey = Object.keys(json.errors)[0];
          const firstMsg = json.errors[firstKey]?.[0];
          throw new Error(firstMsg || json.message || 'Reservation failed');
        }
        throw new Error(json.message || `HTTP ${resp.status}`);
      }
      setData(json);
      return json;
    } catch (e: any) { setError(e); throw e; }
    finally { setLoading(false); }
  };

  // List reservations (optionally filter by status, service_id, date range)
  const listReservations = async (params: { status?:string; service_id?:number; from?:string; to?:string; page?:number; per_page?:number } = {}):Promise<{data:ReservationRecord[], [k:string]:any}> => {
    const qs = new URLSearchParams();
    for (const [k,v] of Object.entries(params)) if (v !== undefined && v !== null) qs.append(k, String(v));
    const url = `${API_BASE}/reservations${qs.toString() ? '?' + qs.toString() : ''}`;
    const resp = await fetch(url);
    const json = await resp.json();
    if (!resp.ok) throw new Error(json.message || 'Failed to fetch reservations');
    return json;
  };

  const getReservation = async (id:number):Promise<ReservationRecord> => {
    const resp = await fetch(`${API_BASE}/reservations/${id}`);
    const json = await resp.json();
    if (!resp.ok) throw new Error(json.message || 'Not found');
    return json;
  };

  // Update reservation (full/partial). For status-only updates you can pass { status: 'CONFIRMED' }
  const updateReservation = async (id:number, patch: Partial<Omit<ReservationRecord,'id'|'created_at'|'updated_at'>>):Promise<ReservationRecord> => {
    const body:any = {};
    // Map front keys to backend expected naming (date_reservation vs date)
    if (patch.full_name) body.full_name = patch.full_name;
    if (patch.email) body.email = patch.email;
    if (patch.phone) body.phone = patch.phone;
    if (patch.country) body.country = patch.country;
    if (patch.service_id) body.service_id = patch.service_id;
    if (patch.date_reservation) body.date_reservation = patch.date_reservation;
    if (patch.guests) body.guests = patch.guests;
    if (patch.note !== undefined) body.note = patch.note;
    if (patch.status) body.status = patch.status; // status included in same endpoint per requirement
    const resp = await fetch(`${API_BASE}/reservations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type':'application/json', ...authHeader() } as Record<string,string>,
      body: JSON.stringify(body),
    });
    const json = await resp.json();
    if (!resp.ok) throw new Error(json.message || 'Update failed');
    return json;
  };

  const deleteReservation = async (id:number):Promise<boolean> => {
  const resp = await fetch(`${API_BASE}/reservations/${id}`, { method:'DELETE', headers: authHeader() as Record<string,string> });
    if (resp.status === 204) return true;
    const json = await resp.json().catch(()=>({}));
    if (!resp.ok) throw new Error(json.message || 'Delete failed');
    return true;
  };

  // -------- Experiences ----------
  const toB64 = (f: File) =>
    new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.onerror = rej;
      r.readAsDataURL(f);
    });

  const createExperience = async (experienceData: ExperienceData) => {
    setLoading(true); setError(null);
    try {
      const payload: any = { city: experienceData.city, place: experienceData.place };
      for (const k of ['img1','img2','img3','img4'] as const) {
        const v: any = (experienceData as any)[k];
        if (v instanceof File) payload[k] = await toB64(v);
        else if (typeof v === 'string') payload[k] = v;
      }
      const resp = await fetch(`${API_BASE}/experiences`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(json.error || json.message || 'Create failed');
      return json;
    } catch (e:any){ setError(e); throw e; }
    finally { setLoading(false); }
  };

  const updateExperience = async (id:number, experienceData:ExperienceData) => {
    setLoading(true); setError(null);
    try {
      const payload:any = { city:experienceData.city, place:experienceData.place };
      for (const k of ['img1','img2','img3','img4'] as const) {
        const v:any = (experienceData as any)[k];
        if (v instanceof File) payload[k] = await toB64(v);
        else if (typeof v === 'string' && v.startsWith('data:')) payload[k] = v;
      }
      const resp = await fetch(`${API_BASE}/experiences/${id}`, {
        method:'PUT',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify(payload),
      });
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(json.error || json.message || 'Update failed');
  return json;
    } catch(e:any){ setError(e); throw e; }
    finally { setLoading(false); }
  };

  const deleteExperience = async (id:number) => {
    setLoading(true); setError(null);
    try {
      const resp = await fetch(`${API_BASE}/experiences/${id}`, { method:'DELETE' });
      if (!resp.ok) throw new Error('Delete failed');
      return true;
    } catch(e:any){ setError(e); throw e; }
    finally { setLoading(false); }
  };

  const fetchExperiences = async ():Promise<ExperienceData[]> => {
    setLoading(true); setError(null);
    try {
      const resp = await fetch(`${API_BASE}/experiences`);
      if (!resp.ok) throw new Error('Fetch failed');
      const json = await resp.json();
      const list = Array.isArray(json) ? json : (json.data || []);
      return transformExperienceData(list);
    } catch(e:any){ setError(e); throw e; }
    finally { setLoading(false); }
  };

  // Keep ONLY this alias (remove duplicate later in file)
  const fetchPublicExperiences = fetchExperiences;

  // -------- Service Types ----------
  const fetchServiceTypes = async () => {
    setLoading(true); setError(null);
    try {
      const resp = await fetch(`${API_BASE}/service-types`);
      if (!resp.ok) throw new Error('Fetch failed');
      const json = await resp.json();
      return Array.isArray(json) ? json : (json.data || []);
    } catch(e:any){ setError(e); throw e; }
    finally { setLoading(false); }
  };

  // Combine service types with their services (client side merge)
  const fetchServiceTypesWithServices = async () => {
    setLoading(true); setError(null);
    try {
      const perPage = 50; // reasonable batch size
      let page = 1; const collected:any[] = [];
      for (; page <= 50; page++) { // safety cap
        const resp = await fetch(`${API_BASE}/service-types?per_page=${perPage}&page=${page}`);
        if (!resp.ok) throw new Error('Fetch failed');
        const json = await resp.json();
        const data = json.data || [];
        collected.push(...data);
        if (page >= (json.last_page || 1)) break;
      }
      return collected.map((t:any) => ({
        id: t.id,
        typeName: t.type_name,
        description: t.description,
        servicesCount: t.services_count,
        services: (t.services || []).map((s:any) => ({
          id: s.id,
          serviceName: s.service_name,
          description: s.description,
          duration: s.duration,
          price: s.price,
          servicesTypeId: s.services_type_id,
          imageBase64: s.image_data,
        })),
      }));
    } catch(e:any){ setError(e); throw e; }
    finally { setLoading(false); }
  };

  const createServiceType = async (st:ServiceType) => {
    setLoading(true); setError(null);
    try {
      const body = { type_name: st.typeName, description: st.description };
      const resp = await fetch(`${API_BASE}/service-types`, {
        method:'POST', headers: jsonAuthHeaders(),
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        let msg = 'Create failed';
        try {
          const err = await resp.json();
          if (err.message) msg = err.message;
          else if (err.errors) msg = Object.values(err.errors).flat().join(', ');
        } catch {}
        throw new Error(msg);
      }
      return await resp.json();
    } catch(e:any){ setError(e); throw e; }
    finally { setLoading(false); }
  };

  const updateServiceType = async (id:number, st:ServiceType) => {
    setLoading(true); setError(null);
    try {
      const body:any = {};
      if (st.typeName) body.type_name = st.typeName;
      if (st.description !== undefined) body.description = st.description;
      const resp = await fetch(`${API_BASE}/service-types/${id}`, {
        method:'PUT', headers: jsonAuthHeaders(),
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        let msg = 'Update failed';
        try {
          const err = await resp.json();
          if (err.message) msg = err.message;
          else if (err.errors) msg = Object.values(err.errors).flat().join(', ');
        } catch {}
        throw new Error(msg);
      }
      return await resp.json();
    } catch(e:any){ setError(e); throw e; }
    finally { setLoading(false); }
  };

  const deleteServiceType = async (id:number) => {
    setLoading(true); setError(null);
    try {
  const resp = await fetch(`${API_BASE}/service-types/${id}`, { method:'DELETE', headers: authHeader() });
      if (!resp.ok) throw new Error('Delete failed');
      return true;
    } catch(e:any){ setError(e); throw e; }
    finally { setLoading(false); }
  };

  // -------- Services ----------
  const transformService = (s:any):ServiceContent => ({
    id: s.id,
    serviceName: s.service_name,
    description: s.description,
    duration: s.duration,
    price: s.price,
    servicesTypeId: s.services_type_id,
    imageBase64: s.image_data,
    serviceTypeName: s.service_type?.type_name,
    serviceType: s.service_type ? { id: s.service_type.id, typeName: s.service_type.type_name } : undefined,
  });

  const buildServiceQuery = (q:ServiceQuery = {}) => {
    const params = new URLSearchParams();
    if (q.page) params.set('page', String(q.page));
    if (q.perPage) params.set('per_page', String(q.perPage));
    if (q.q) params.set('q', q.q);
    if (q.servicesTypeId) params.set('services_type_id', String(q.servicesTypeId));
    if (q.minPrice !== undefined) params.set('min_price', String(q.minPrice));
    if (q.maxPrice !== undefined) params.set('max_price', String(q.maxPrice));
    return params.toString();
  };

  // Fetch paginated services (raw paginated object mapped)
  const fetchServices = async (query:ServiceQuery = {}):Promise<Paginated<ServiceContent>> => {
    setLoading(true); setError(null);
    try {
      const qs = buildServiceQuery(query);
      const resp = await fetch(`${API_BASE}/services${qs ? `?${qs}` : ''}`);
      if (!resp.ok) throw new Error('Fetch failed');
      const json = await resp.json();
      // json is expected paginated object { data: [...], ... }
      const pageObj:Paginated<ServiceContent> = {
        ...json,
        data: (json.data || []).map(transformService),
      };
      return pageObj;
    } catch(e:any){ setError(e); throw e; }
    finally { setLoading(false); }
  };

  // Convenience: fetch all (iterate pages) - be cautious for large datasets
  const fetchAllServices = async (query:Omit<ServiceQuery,'page'> = {}):Promise<ServiceContent[]> => {
    setLoading(true); setError(null);
    try {
      const perPage = query.perPage || 100;
      let page = 1; const all:ServiceContent[] = [];
      // first page
      // Use a loop to accumulate. Break safety after 50 pages to avoid infinite loop.
      for (; page <= 50; page++) {
        const res = await fetchServices({ ...query, page, perPage });
        all.push(...res.data);
        if (page >= res.last_page) break;
      }
      return all;
    } catch(e:any){ setError(e); throw e; }
    finally { setLoading(false); }
  };

  const getService = async (id:number):Promise<ServiceContent> => {
    setLoading(true); setError(null);
    try {
      const resp = await fetch(`${API_BASE}/services/${id}`);
      if (!resp.ok) throw new Error('Fetch failed');
      const json = await resp.json();
      return transformService(json);
    } catch(e:any){ setError(e); throw e; }
    finally { setLoading(false); }
  };

  // create service given its parent service type id (matches admin page usage)
  const createService = async (servicesTypeId:number, svc:ServiceContent) => {
    setLoading(true); setError(null);
    try {
      const body:any = {
        service_name: svc.serviceName,
        description: svc.description,
        duration: svc.duration,
        price: svc.price,
        services_type_id: servicesTypeId,
      };
      if ((svc as any).imageFile instanceof File) {
        body.image_data = await toB64((svc as any).imageFile);
      } else if (svc.imageBase64) body.image_data = svc.imageBase64;
      const resp = await fetch(`${API_BASE}/services`, {
        method:'POST', headers: jsonAuthHeaders(),
        body: JSON.stringify(body),
      });
      const json = await resp.json().catch(()=>({}));
      if (!resp.ok) {
        let msg = 'Create failed';
        if (json.message) msg = json.message;
        else if (json.error) msg = json.error;
        else if (json.errors) msg = Object.values(json.errors).flat().join(', ');
        throw new Error(msg);
      }
      return transformService(json);
    } catch(e:any){ setError(e); throw e; }
    finally { setLoading(false); }
  };

  const updateService = async (id:number, svc:Partial<ServiceContent & { servicesTypeId?:number, imageFile?:File }>) => {
    setLoading(true); setError(null);
    try {
      const body:any = {};
      if (svc.serviceName) body.service_name = svc.serviceName;
      if (svc.description !== undefined) body.description = svc.description;
      if (svc.duration) body.duration = svc.duration;
      if (svc.price !== undefined) body.price = svc.price;
      if (svc.servicesTypeId) body.services_type_id = svc.servicesTypeId;
      if ((svc as any).imageFile instanceof File) {
        body.image_data = await toB64((svc as any).imageFile);
      } else if ((svc as any).imageBase64) body.image_data = (svc as any).imageBase64;
      const resp = await fetch(`${API_BASE}/services/${id}`, {
        method:'PUT', headers: jsonAuthHeaders(),
        body: JSON.stringify(body),
      });
      const json = await resp.json().catch(()=>({}));
      if (!resp.ok) {
        let msg = 'Update failed';
        if (json.message) msg = json.message;
        else if (json.error) msg = json.error;
        else if (json.errors) msg = Object.values(json.errors).flat().join(', ');
        throw new Error(msg);
      }
      return transformService(json);
    } catch(e:any){ setError(e); throw e; }
    finally { setLoading(false); }
  };

  const deleteService = async (id:number) => {
    setLoading(true); setError(null);
    try {
  const resp = await fetch(`${API_BASE}/services/${id}`, { method:'DELETE', headers: authHeader() });
      if (!resp.ok) throw new Error('Delete failed');
      return true;
    } catch(e:any){ setError(e); throw e; }
    finally { setLoading(false); }
  };

  // Fetch services with optional filters and return either flat list or grouped by service type
  const fetchFilteredServices = async (opts: { servicesTypeId?:number; minPrice?:number; maxPrice?:number; q?:string; perPage?:number; groupByType?:boolean } = {}) => {
    setLoading(true); setError(null);
    try {
      const perPage = opts.perPage || 50;
      let page = 1; const all: any[] = [];
      for (; page <= 50; page++) { // safety cap
        const qs = buildServiceQuery({
          page,
            perPage,
            q: opts.q,
            servicesTypeId: opts.servicesTypeId,
            minPrice: opts.minPrice,
            maxPrice: opts.maxPrice,
        });
        const resp = await fetch(`${API_BASE}/services?${qs}`);
        if (!resp.ok) throw new Error('Fetch failed');
        const json = await resp.json();
        const data = (json.data || []).map(transformService);
        all.push(...data);
        if (page >= (json.last_page || 1)) break;
      }
      if (!opts.groupByType) return all;
      const grouped: Record<string, { typeId:number|undefined; typeName:string; services:ServiceContent[] }> = {};
      all.forEach(s => {
        const typeId = s.servicesTypeId;
        const typeName = s.serviceTypeName || s.serviceType?.typeName || 'Unknown';
        const key = String(typeId ?? 'unknown');
        if (!grouped[key]) grouped[key] = { typeId, typeName, services: [] };
        grouped[key].services.push(s);
      });
      return Object.values(grouped);
    } catch(e:any){ setError(e); throw e; }
    finally { setLoading(false); }
  };

  // -------- Feedback ----------
  const createFeedback = async (fb:FeedbackData):Promise<ApiResponse> => {
    setLoading(true); setError(null);
    try {
      const body = { email: fb.email, full_name: fb.fullName, subject: fb.subject, message: fb.message };
      const resp = await fetch(`${API_BASE}/feedback`, {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify(body),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.message || 'Error');
      return json;
    } catch(e:any){ setError(e); throw e; }
    finally { setLoading(false); }
  };

  const getAllFeedbacks = async () => {
    setLoading(true); setError(null);
    try {
      const resp = await fetch(`${API_BASE}/feedback`);
      if (!resp.ok) throw new Error('Fetch failed');
      const json = await resp.json();
      return Array.isArray(json) ? json : (json.data || []);
    } catch(e:any){ setError(e); throw e; }
    finally { setLoading(false); }
  };

  const updateFeedbackStatus = async (id:number, status:string) => {
    setLoading(true); setError(null);
    try {
      const resp = await fetch(`${API_BASE}/feedback/${id}`, {
        method:'PUT',
        headers:{ 'Content-Type':'application/json'},
        body: JSON.stringify({ status }),
      });
      if (!resp.ok) throw new Error('Update failed');
      return await resp.json();
    } catch(e:any){ setError(e); throw e; }
    finally { setLoading(false); }
  };

  const deleteFeedback = async (id:number) => {
    setLoading(true); setError(null);
    try {
      const resp = await fetch(`${API_BASE}/feedback/${id}`, { method:'DELETE'} );
      if (!resp.ok) throw new Error('Delete failed');
      return true;
    } catch(e:any){ setError(e); throw e; }
    finally { setLoading(false); }
  };

  // ---- Authenticated User ----
  const fetchAuthUserData = async () => {
    // If no token stored, short‑circuit to avoid 500 caused by redirect to missing named route
    const token = getToken();
    if (!token) return null;
    try {
  const headers: Record<string,string> = { 'Accept': 'application/json', ...authHeader() as any };
  const resp = await fetch(`${API_BASE}/userAuth`, { headers });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Fetch auth user failed (${resp.status}): ${txt}`);
      }
      return await resp.json();
    } catch (er:any) {
      console.error('fetchAuthUser error', er);
      return null;
    }
  }

  /// update the auth user 
  const fetchAuthUser = fetchAuthUserData;

  const updateAuthUser = async (userId:number, payload:Partial<AuthUser>) => {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');
    const body:any = {};
    for (const k of ['email','username','city','country','phone','description1','description2','description3','description4'] as const) {
      if (payload[k] !== undefined) body[k] = payload[k];
    }
    const resp = await fetch(`${API_BASE}/users/${userId}`, {
      method:'PUT',
  headers:{ 'Content-Type':'application/json', 'Accept':'application/json', ...authHeader() } as Record<string,string>,
      body: JSON.stringify(body)
    });
    const json = await resp.json();
    if (!resp.ok) throw new Error(json.message || 'Update failed');
    return json;
  };

  const updateAuthUserLogo = async (userId:number, file:File) => {
    const token = getToken();
    if(!token) throw new Error('Not authenticated');
    const fd = new FormData();
    fd.append('logo', file);
    const resp = await fetch(`${API_BASE}/users/${userId}/logo`, {
      method:'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: fd
    });
    const json = await resp.json();
    if(!resp.ok) throw new Error(json.message || 'Logo update failed');
    return json; // contains message + logo_url
  };

  const updateAuthUserDescriptions = async (userId:number, d1?:string,d2?:string,d3?:string,d4?:string) => {
    const body:any = {};
    if (d1!==undefined) body.description1=d1;
    if (d2!==undefined) body.description2=d2;
    if (d3!==undefined) body.description3=d3;
    if (d4!==undefined) body.description4=d4;
    const resp = await fetch(`${API_BASE}/users/${userId}`, {
      method:'PUT',
      headers:{ 'Content-Type':'application/json', 'Accept':'application/json', ...authHeader() } as Record<string,string>,
      body: JSON.stringify(body)
    });
    const json = await resp.json();
    if (!resp.ok) throw new Error(json.message || 'Descriptions update failed');
    return json;
  };

  const updateAuthUserGalleryImage = async (userId:number, slot:number, file:File) => {
    if(![1,2,3,4,5].includes(slot)) throw new Error('slot must be 1..5');
    const token = getToken();
    if(!token) throw new Error('Not authenticated');
    const fd = new FormData();
    fd.append('image', file);
    const resp = await fetch(`${API_BASE}/users/${userId}/gallery/${slot}`, {
      method:'POST',
      headers: { 'Authorization':`Bearer ${token}` },
      body: fd
    });
    const json = await resp.json();
    if(!resp.ok) throw new Error(json.message || 'Image update failed');
    return json;
  };

  // Public about page data fetch (first user or by id)
  const fetchAboutData = async (userId:number = 1) => {
    const resp = await fetch(`${API_BASE}/users?per_page=1`); // simplistic; could create dedicated endpoint
    if(!resp.ok) return null;
    const list = await resp.json();
    const user = list.data ? list.data.find((u:any)=>u.id===userId) || list.data[0] : null;
    if(!user) return null;
    // If we need detailed fields including descriptions and gallery images, call /userAuth if same user (requires token) or create a new public endpoint.
    return user;
  };
  

  // Stubs (not implemented backend)
  const fetchExperienceStats = async () => { throw new Error('Endpoint not defined'); };
  const sendFeedbackEmail = async () => { throw new Error('Use notifications endpoint'); };
  const getFeedbackByEmail = async () => { throw new Error('Endpoint not defined'); };
  const getFeebacksFromAdmin = getAllFeedbacks;
  const getFeedbackStats = async () => { throw new Error('Endpoint not defined'); };

  // Replace stub fetchAllCities with real implementation
  const fetchAllCities = async () => {
    const exps = await fetchExperiences();
    // unique city names
    return Array.from(new Set(exps.map(e => e.city).filter(Boolean)));
  };

  return {
    data, loading, error,
    // Reservations
  postReservation, listReservations, getReservation, updateReservation, deleteReservation,
    // Experiences
    fetchExperiences, fetchPublicExperiences, createExperience, updateExperience, deleteExperience,
    // Service Types
    fetchServiceTypes, fetchServiceTypesWithServices, createServiceType, updateServiceType, deleteServiceType,
    // Services
  fetchServices, fetchAllServices, getService, createService, updateService, deleteService, fetchFilteredServices,
    // Feedback
    createFeedback, getAllFeedbacks, updateFeedbackStatus, deleteFeedback,
    // Misc / stubs
    fetchExperienceStats, fetchAllCities, sendFeedbackEmail, getFeedbackByEmail, getFeebacksFromAdmin, getFeedbackStats,
  fetchAuthUser, updateAuthUser, updateAuthUserLogo, updateAuthUserDescriptions, updateAuthUserGalleryImage,
  fetchAboutData,
  };
};

export default useApi;