import React, { useState, useEffect } from 'react';
import { useComplaints } from '../hooks/useComplaints';
import { GrievanceMap } from '../components/map/GrievanceMap';
import { Modal } from '../components/common/Modal';
import {
  MapPin,
  Filter,
  Layers,
  Radio,
  Settings2,
  Compass,
  CheckCircle2,
  Navigation,
  Globe,
} from 'lucide-react';

interface VillagePreset {
  name: string;
  lat: number;
  lng: number;
  zoom: number;
  radiusKm: number;
}

const VILLAGE_PRESETS: VillagePreset[] = [
  {
    name: 'Rampur Gram Panchayat',
    lat: 26.8485,
    lng: 80.9482,
    zoom: 14,
    radiusKm: 2.5,
  },
  {
    name: 'Shivpur Panchayat',
    lat: 26.8620,
    lng: 80.9650,
    zoom: 14,
    radiusKm: 2.0,
  },
  {
    name: 'Belwa Panchayat',
    lat: 26.8320,
    lng: 80.9310,
    zoom: 14,
    radiusKm: 2.2,
  },
  {
    name: 'Madhopur Panchayat',
    lat: 26.8710,
    lng: 80.9250,
    zoom: 14,
    radiusKm: 2.0,
  },
  {
    name: 'Kalyanpur Panchayat',
    lat: 26.8250,
    lng: 80.9600,
    zoom: 14,
    radiusKm: 2.8,
  },
];

const SAVED_VILLAGE_KEY = 'gramsetu_active_village';

export const MapViewPage: React.FC = () => {
  const { complaints, filterOptions } = useComplaints();
  const [selectedVillageName, setSelectedVillageName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(SAVED_VILLAGE_KEY);
      return saved ? JSON.parse(saved).name : 'Rampur Gram Panchayat';
    } catch {
      return 'Rampur Gram Panchayat';
    }
  });

  const [activeVillage, setActiveVillage] = useState<VillagePreset>(() => {
    try {
      const saved = localStorage.getItem(SAVED_VILLAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return VILLAGE_PRESETS[0];
  });

  const [strictVillageFilter, setStrictVillageFilter] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isPickingLocation, setIsPickingLocation] = useState(false);

  // Custom Form state for modal
  const [customName, setCustomName] = useState(activeVillage.name);
  const [customLat, setCustomLat] = useState(activeVillage.lat.toString());
  const [customLng, setCustomLng] = useState(activeVillage.lng.toString());
  const [customRadius, setCustomRadius] = useState(activeVillage.radiusKm.toString());

  const handleVillageSelect = (villageName: string) => {
    setSelectedVillageName(villageName);
    const found = VILLAGE_PRESETS.find((v) => v.name === villageName);
    if (found) {
      setActiveVillage(found);
      setCustomName(found.name);
      setCustomLat(found.lat.toString());
      setCustomLng(found.lng.toString());
      setCustomRadius(found.radiusKm.toString());
      localStorage.setItem(SAVED_VILLAGE_KEY, JSON.stringify(found));
    }
  };

  const handleSaveCustomVillage = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat) || 26.8485;
    const lng = parseFloat(customLng) || 80.9482;
    const radius = parseFloat(customRadius) || 2.5;

    const newVillage: VillagePreset = {
      name: customName.trim() || 'My Gram Panchayat',
      lat,
      lng,
      zoom: 14,
      radiusKm: radius,
    };

    setActiveVillage(newVillage);
    setSelectedVillageName(newVillage.name);
    localStorage.setItem(SAVED_VILLAGE_KEY, JSON.stringify(newVillage));
    setIsConfigModalOpen(false);
    setIsPickingLocation(false);
  };

  const handleMapLocationPicked = (lat: number, lng: number) => {
    setCustomLat(lat.toFixed(5));
    setCustomLng(lng.toFixed(5));
    setIsPickingLocation(false);
    setIsConfigModalOpen(true);
  };

  // Filter complaints based on strict village matching + status + category
  const filteredMappable = complaints.filter((c) => {
    if (strictVillageFilter) {
      const matchVillage =
        (c.village || '').toLowerCase().includes(activeVillage.name.toLowerCase().replace('gram panchayat', '').trim()) ||
        activeVillage.name.toLowerCase().includes((c.village || '').toLowerCase().trim());
      if (!matchVillage) return false;
    }
    if (selectedCategory !== 'All' && c.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (selectedStatus !== 'All' && c.status?.toLowerCase() !== selectedStatus.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Grievance GIS Geospatial Map
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-400 font-mono">
              <Radio className="w-3 h-3 animate-pulse" /> LIVE GPS
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Spatial distribution & boundaries of citizen reports • Focused on{' '}
            <strong className="text-emerald-700 dark:text-emerald-400">{activeVillage.name}</strong>
          </p>
        </div>

        {/* Village Selection & Controls Deck */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Village Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-sm">
            <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <select
              value={selectedVillageName}
              onChange={(e) => handleVillageSelect(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              {VILLAGE_PRESETS.map((v) => (
                <option key={v.name} value={v.name} className="dark:bg-slate-900 text-slate-900 dark:text-white">
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Set / Customize Village Location Button */}
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800/80 rounded-xl transition-all shadow-sm"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Set Village GPS</span>
          </button>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-civic-500 shadow-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-civic-500 shadow-sm"
          >
            <option value="All">All Categories</option>
            {filterOptions.categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Village Focus Toggle Bar */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs shadow-sm flex-wrap gap-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={strictVillageFilter}
            onChange={(e) => setStrictVillageFilter(e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
          />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Show ONLY complaints within <span className="text-emerald-600 dark:text-emerald-400 font-bold">{activeVillage.name}</span>
          </span>
        </label>

        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
          <span>GPS: {activeVillage.lat.toFixed(4)}° N, {activeVillage.lng.toFixed(4)}° E</span>
          <span>•</span>
          <span>Boundary: {activeVillage.radiusKm} km radius</span>
          <span>•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold font-sans">
            {filteredMappable.length} Grievances on Map
          </span>
        </div>
      </div>

      {/* Leaflet Map Component */}
      <GrievanceMap
        complaints={filteredMappable}
        center={[activeVillage.lat, activeVillage.lng]}
        zoom={activeVillage.zoom}
        height="640px"
        villageName={activeVillage.name}
        radiusMeters={activeVillage.radiusKm * 1000}
        showBoundary={true}
        isPickingLocation={isPickingLocation}
        onLocationPicked={handleMapLocationPicked}
      />

      {/* Set Village GPS Location Modal */}
      <Modal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        title="Set Gram Panchayat Village Location"
        subtitle="Configure the exact GPS center coordinates and jurisdiction radius for this dashboard"
        maxWidth="md"
      >
        <form onSubmit={handleSaveCustomVillage} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Gram Panchayat Village Name
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Rampur Gram Panchayat"
              required
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Latitude (°N)
              </label>
              <input
                type="number"
                step="0.0001"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                placeholder="26.8485"
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Longitude (°E)
              </label>
              <input
                type="number"
                step="0.0001"
                value={customLng}
                onChange={(e) => setCustomLng(e.target.value)}
                placeholder="80.9482"
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Panchayat Boundary Radius (in Kilometers)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              max="20"
              value={customRadius}
              onChange={(e) => setCustomRadius(e.target.value)}
              placeholder="2.5"
              required
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Pick on Map shortcut */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                setIsConfigModalOpen(false);
                setIsPickingLocation(true);
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Click on Map to Pick Village Coordinates</span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsConfigModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md"
            >
              Save & Focus Village
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
