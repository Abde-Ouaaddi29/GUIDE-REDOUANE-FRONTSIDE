"use client";
import { useEffect, useState } from "react";
import useApi from "@/hooks/useApi";

interface ServiceContent {
    id?: number;
    serviceName: string;
    description: string;
    duration: string;
    price: number;
    imageBase64?: string | null;
    imageFile?: File;
}

interface ServiceType {
    id?: number;
    typeName: string;
    description: string;
    services?: ServiceContent[];
}

export default function AdminServicesPage() {
    const {
        fetchServiceTypesWithServices,
        createServiceType,
        updateServiceType,
        deleteServiceType,
        createService,
        updateService,
        deleteService,
        loading,
        error,
    } = useApi();

    const [types, setTypes] = useState<ServiceType[]>([]);
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});

    // Modals
    const [showTypeModal, setShowTypeModal] = useState(false);
    const [showServiceModal, setShowServiceModal] = useState(false);

    // Editing state
    const [editingType, setEditingType] = useState<ServiceType | null>(null);
    const [editingService, setEditingService] = useState<ServiceContent | null>(null);
    const [selectedType, setSelectedType] = useState<ServiceType | null>(null);

    // Forms
    const [typeForm, setTypeForm] = useState({ typeName: "", description: "" });
    const [serviceForm, setServiceForm] = useState<{
        serviceName: string;
        description: string;
        duration: string;
        price: number;
        imageFile?: File;
    }>({ serviceName: "", description: "", duration: "", price: 0 });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Load data
    const load = async () => {
        try {
            const data = await fetchServiceTypesWithServices();
            setTypes(data);
        } catch (e) {
            console.error(e);
        }
    };
    useEffect(() => { load(); }, []); // initial fetch

    // -------- Service Type handlers --------
    const openTypeModal = (t?: ServiceType) => {
        if (t) {
            setEditingType(t);
            setTypeForm({ typeName: t.typeName, description: t.description });
        } else {
            setEditingType(null);
            setTypeForm({ typeName: "", description: "" });
        }
        setShowTypeModal(true);
    };

    const submitType = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingType) await updateServiceType(editingType.id!, typeForm);
            else await createServiceType(typeForm);
            closeTypeModal();
            await load();
        } catch (e) { console.error(e); }
    };

    const deleteTypeConfirm = async (id: number) => {
        if (!confirm("Delete this service type?")) return;
        try {
            await deleteServiceType(id);
            await load();
        } catch (e) { console.error(e); }
    };

    const closeTypeModal = () => {
        setShowTypeModal(false);
        setEditingType(null);
        setTypeForm({ typeName: "", description: "" });
    };

    // -------- Service handlers --------
    const openServiceModal = (type: ServiceType, svc?: ServiceContent) => {
        setSelectedType(type);
        if (svc) {
            setEditingService(svc);
            setServiceForm({
                serviceName: svc.serviceName,
                description: svc.description,
                duration: svc.duration,
                price: svc.price,
            });
            setImagePreview(svc.imageBase64 || null);
        } else {
            setEditingService(null);
            setServiceForm({ serviceName: "", description: "", duration: "", price: 0 });
            setImagePreview(null);
        }
        setShowServiceModal(true);
    };

    const submitService = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedType) return;
        
        // Show loading state
        // setLoading(true);
        
        try {
            if (editingService) {
                await updateService(editingService.id!, { ...serviceForm });
            } else {
                await createService(selectedType.id!, { ...serviceForm });
            }
            closeServiceModal();
            await load();
        } catch (e: any) { 
            console.error(e); 
            // Show user-friendly error message
            alert(e.message || 'An error occurred while saving the service. Please try again.');
        } finally {
            // setLoading(false);
        }
    };

    const deleteServiceConfirm = async (id: number) => {
        if (!confirm("Delete this service?")) return;
        try { await deleteService(id); await load(); } catch (e) { console.error(e); }
    };

    const closeServiceModal = () => {
        setShowServiceModal(false);
        setEditingService(null);
        setSelectedType(null);
        setServiceForm({ serviceName: "", description: "", duration: "", price: 0 });
        setImagePreview(null);
    };

    // -------- UI helpers --------
    const toggleExpanded = (id: number) => setExpanded(p => ({ ...p, [id]: !p[id] }));

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        // Validate file size
        if (file.size > 5 * 1024 * 1024) {
            alert('Image file too large. Please use an image smaller than 5MB.');
            e.target.value = '';
            return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            e.target.value = '';
            return;
        }
        
        setServiceForm(f => ({ ...f, imageFile: file }));
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Services Admin</h1>
                <button onClick={() => openTypeModal()} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">New Service Type</button>
            </div>
            {error && <div className="text-sm text-red-600">{error.message}</div>}
            {loading && <div className="text-sm text-gray-500">Loading...</div>}

            <div className="space-y-4">
                {types.map(t => (
                    <div key={t.id} className="border rounded-md bg-white shadow-sm p-4">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="font-medium text-lg flex items-center gap-2">
                                    {t.typeName}
                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{t.services?.length || 0}</span>
                                </h2>
                                {t.description && <p className="text-sm text-gray-600 mt-1 max-w-prose whitespace-pre-wrap">{t.description}</p>}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => openTypeModal(t)} className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">Edit</button>
                                <button onClick={() => deleteTypeConfirm(t.id!)} className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">Delete</button>
                                <button onClick={() => openServiceModal(t)} className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">Add Service</button>
                                <button onClick={() => toggleExpanded(t.id!)} className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded">{expanded[t.id!] ? "Hide" : "Show"}</button>
                            </div>
                        </div>

                        {expanded[t.id!] && (
                            <div className="mt-4 space-y-3">
                                {t.services && t.services.length > 0 ? (
                                    t.services.map(s => (
                                        <div key={s.id} className="flex items-center justify-between border rounded px-3 py-2">
                                            <div className="flex items-center gap-4">
                                                {s.imageBase64 && (
                                                    <img src={s.imageBase64} alt={s.serviceName} className="w-16 h-16 object-cover rounded" />
                                                )}
                                                <div>
                                                    <p className="font-medium text-sm">{s.serviceName}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {s.duration} {s.duration && s.price ? "·" : ""} {s.price != null ? `$${s.price}` : ""}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => openServiceModal(t, s)} className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">Edit</button>
                                                <button onClick={() => deleteServiceConfirm(s.id!)} className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">Delete</button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No services yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                {types.length === 0 && !loading && (
                    <div className="text-sm text-gray-500">No service types found.</div>
                )}
            </div>

            {/* Type Modal */}
            {showTypeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-md rounded shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">{editingType ? "Edit Service Type" : "New Service Type"}</h3>
                        <form onSubmit={submitType} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Type Name</label>
                                <input
                                    value={typeForm.typeName}
                                    onChange={e => setTypeForm(f => ({ ...f, typeName: e.target.value }))}
                                    required
                                    className="w-full border rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={typeForm.description}
                                    onChange={e => setTypeForm(f => ({ ...f, description: e.target.value }))}
                                    rows={3}
                                    className="w-full border rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeTypeModal}
                                    className="px-4 py-2 text-sm rounded border"
                                >Cancel</button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm rounded bg-blue-600 text-white"
                                >{editingType ? "Update" : "Create"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Service Modal */}
            {showServiceModal && selectedType && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-lg rounded shadow-lg p-6 mt-20">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingService ? "Edit Service" : "New Service"} <span className="text-sm text-gray-500">in {selectedType.typeName}</span>
                        </h3>
                        <form onSubmit={submitService} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Service Name</label>
                                    <input
                                        value={serviceForm.serviceName}
                                        onChange={e => setServiceForm(f => ({ ...f, serviceName: e.target.value }))}
                                        required
                                        className="w-full border rounded px-3 py-2 text-sm"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        value={serviceForm.description}
                                        onChange={e => setServiceForm(f => ({ ...f, description: e.target.value }))}
                                        rows={3}
                                        className="w-full border rounded px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Duration</label>
                                    <input
                                        value={serviceForm.duration}
                                        onChange={e => setServiceForm(f => ({ ...f, duration: e.target.value }))}
                                        className="w-full border rounded px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price</label>
                                    <input
                                        type="number"
                                        value={serviceForm.price}
                                        onChange={e => setServiceForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                                        className="w-full border rounded px-3 py-2 text-sm"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Image</label>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm" />
                                    {imagePreview && (
                                        <img src={imagePreview} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded" />
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={closeServiceModal} className="px-4 py-2 text-sm rounded border">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm rounded bg-green-600 text-white">{editingService ? "Update" : "Create"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
