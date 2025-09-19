"use client"
import React, { useEffect, useMemo, useState } from 'react';
import useApi from '@/hooks/useApi';
import { URL_SERVER } from '@/app/constants';

interface ServiceOption { id:number; name?:string; title?:string; }

interface Reservation {
    id:number; full_name:string; email:string; phone:string; service_id:number; date_reservation:string; guests:number; status:string; note?:string|null;
    service_name?:string; // enriched client side if available
}

const ReservationsPage = () => {
    const [rawReservations, setRawReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true); // initial load flag
    const [refreshing, setRefreshing] = useState(false); // subsequent filter refresh
    const [error, setError] = useState<string | null>(null);
    const api = useApi();
    const [updatingId, setUpdatingId] = useState<number|null>(null);
    // Filters
    // Editable (UI) filter inputs
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [serviceFilter, setServiceFilter] = useState<string>('');
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    // Applied (effective) filters used for querying backend
    const [appliedStatus, setAppliedStatus] = useState<string>('');
    const [appliedService, setAppliedService] = useState<string>('');
    const [appliedFrom, setAppliedFrom] = useState<string>('');
    const [appliedTo, setAppliedTo] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [services, setServices] = useState<ServiceOption[]>([]);
    const [servicesLoading, setServicesLoading] = useState<boolean>(false);

    // Build query params for backend-supported filters
    const buildQuery = () => {
        const params: Record<string, string> = { per_page: '50' };
        if (appliedStatus) params.status = appliedStatus;
        if (appliedService) params.service_id = appliedService;
        if (appliedFrom) params.from = appliedFrom;
        if (appliedTo) params.to = appliedTo;
        return params;
    };

    // Fetch reservations when applied (effective) filters change
    useEffect(() => {
        let cancelled = false;
        const fetchData = async () => {
            if (!loading) setRefreshing(true);
            setError(null);
            try {
                const params = buildQuery();
                const paged = await api.listReservations(params as any);
                if (cancelled) return;
                const rawList:Reservation[] = (paged.data || paged).map((r:any) => ({ ...r }));
                setRawReservations(rawList);
            } catch (err:any) {
                if (!cancelled) setError(err.message || 'Failed to load reservations');
            } finally {
                if (cancelled) return;
                if (loading) setLoading(false); else setRefreshing(false);
            }
        };
        fetchData();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appliedStatus, appliedService, appliedFrom, appliedTo]);

    // Fetch services for filter dropdown
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setServicesLoading(true);
                const resp = await fetch(`${URL_SERVER}/api/v1/services?per_page=200`);
                if (!resp.ok) throw new Error('Failed services');
                const json = await resp.json();
                const data = (json && json.data) ? json.data : json; // in case of pagination
                const mapped: ServiceOption[] = Array.isArray(data) ? data.map((s:any)=>({ id: s.id, name: s.name || s.title })) : [];
                if (!cancelled) setServices(mapped);
            } catch {
                // ignore silently; dropdown will just show All
            } finally {
                if(!cancelled) setServicesLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // Derive enriched reservations with service name when services change
    const reservations = useMemo(() => {
        if (!rawReservations.length) return [] as Reservation[];
        if (!services.length) return rawReservations;
        const map = new Map(services.map(s => [s.id, s.name || s.title]));
        return rawReservations.map(r => ({ ...r, service_name: map.get(r.service_id) }));
    }, [rawReservations, services]);

    // Client-side search filter for name/email/phone
    const filteredReservations = useMemo(() => {
        if (!search.trim()) return reservations;
        const term = search.toLowerCase();
        return reservations.filter(r =>
            r.full_name?.toLowerCase().includes(term) ||
            r.email?.toLowerCase().includes(term) ||
            (r.phone || '').toLowerCase().includes(term)
        );
    }, [search, reservations]);

    const anyLoading = loading; // only show full overlay for very first load
    const filtersDirty = (
        statusFilter !== appliedStatus ||
        serviceFilter !== appliedService ||
        fromDate !== appliedFrom ||
        toDate !== appliedTo
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Manage Reservations</h1>
                    <p className="text-sm text-gray-500 mt-1">Filter and manage recent bookings.</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                    <div className="px-2 py-1 bg-gray-100 rounded">Total: {reservations.length}</div>
                    {statusFilter && <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded">Status: {statusFilter}</div>}
                    {serviceFilter && <div className="px-2 py-1 bg-purple-50 text-purple-600 rounded">Service: {serviceFilter}</div>}
                    {(fromDate||toDate) && <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded">Date Range</div>}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600 mb-1">Status</label>
                        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="border-gray-300 text-sm rounded px-2 py-2 focus:ring-orange-300 focus:border-orange-300">
                            <option value="">All</option>
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600 mb-1">Service</label>
                        <select value={serviceFilter} onChange={e=>setServiceFilter(e.target.value)} className="border-gray-300 text-sm rounded px-2 py-2 focus:ring-orange-300 focus:border-orange-300" disabled={servicesLoading}>
                            <option value="">All</option>
                            {services.map(s=> <option key={s.id} value={s.id}>{s.name || s.title || `Service #${s.id}`}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600 mb-1">From</label>
                        <input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} className="border-gray-300 text-sm rounded px-2 py-2 focus:ring-orange-300 focus:border-orange-300" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600 mb-1">To</label>
                        <input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} className="border-gray-300 text-sm rounded px-2 py-2 focus:ring-orange-300 focus:border-orange-300" />
                    </div>
                    <div className="flex flex-col lg:col-span-2">
                        <label className="text-xs font-semibold text-gray-600 mb-1">Search (name / email / phone)</label>
                        <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Type to filter locally..." className="border-gray-300 text-sm rounded px-3 py-2 focus:ring-orange-300 focus:border-orange-300" />
                    </div>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                    <button onClick={()=>{ setStatusFilter(''); setServiceFilter(''); setFromDate(''); setToDate(''); setSearch(''); }} className="px-4 py-2 text-sm rounded border border-gray-300 bg-white hover:bg-gray-50">Reset</button>
                    <button onClick={()=>{ if(!filtersDirty) return; setAppliedStatus(statusFilter); setAppliedService(serviceFilter); setAppliedFrom(fromDate); setAppliedTo(toDate); }} disabled={!filtersDirty || loading || refreshing} className="px-4 py-2 text-sm rounded bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-60 flex items-center gap-2">
                        {(refreshing || loading) && !loading && <span className="w-3 h-3 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />}
                        Apply Filters
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 rounded bg-red-50 text-red-600 text-sm border border-red-200">{error}</div>
            )}

            <div className="grid gap-6">
                {filteredReservations.map(reservation => (
                    <div
                        key={reservation.id}
                        className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                                                <h3 className="text-lg font-semibold text-gray-800">{reservation.full_name}</h3>
                                                                <p className="text-sm text-gray-600">{reservation.email}</p>
                                                                <p className="text-sm text-gray-600">{reservation.phone}</p>
                            </div>
                            <div className="text-right">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                    reservation.status === 'CONFIRMED'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : reservation.status === 'PENDING'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : reservation.status === 'CANCELLED'
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }`}>{reservation.status}</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                                <span className="font-medium">Service:</span> {reservation.service_name || `#${reservation.service_id}`}
                            </div>
                            <div>
                                                                <span className="font-medium">Date:</span> {new Date(reservation.date_reservation).toLocaleDateString()}
                            </div>
                            <div>
                                <span className="font-medium">Guests:</span> {reservation.guests}
                            </div>
                        </div>

                        <div className="mt-4 flex space-x-2">
                                                        <button
                                                            onClick={async ()=>{ setUpdatingId(reservation.id); try { await api.updateReservation(reservation.id,{ status:'CONFIRMED'}); setRawReservations((rs:Reservation[])=>rs.map((r:Reservation)=>r.id===reservation.id?{...r,status:'CONFIRMED'}:r)); } catch(e){} finally{ setUpdatingId(null);} }}
                                                            disabled={updatingId===reservation.id || reservation.status==='CONFIRMED'}
                                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm">Confirm</button>
                                                        <button
                                                            onClick={async ()=>{ setUpdatingId(reservation.id); try { await api.updateReservation(reservation.id,{ status:'CANCELLED'}); setRawReservations((rs:Reservation[])=>rs.map((r:Reservation)=>r.id===reservation.id?{...r,status:'CANCELLED'}:r)); } catch(e){} finally{ setUpdatingId(null);} }}
                                                            disabled={updatingId===reservation.id || reservation.status==='CANCELLED'}
                                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm">Cancel</button>
                                                        {/* <button
                                                            onClick={()=> window.location.href = `mailto:${reservation.email}`}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Contact</button> */}
                        </div>
                    </div>
                ))}
            </div>

            {!anyLoading && filteredReservations.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">No reservations found.</div>
                    <p className="text-gray-400 mt-2">
                        New reservations will appear here when customers book tours.
                    </p>
                </div>
            )}

            {anyLoading && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white border border-gray-200 shadow-lg rounded-lg px-6 py-4 flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-gray-700">Loading...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservationsPage;