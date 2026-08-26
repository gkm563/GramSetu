import React, { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Complaint } from '../../types/complaint';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { useNavigate } from 'react-router-dom';
import { Eye, MapPin, Navigation, Compass } from 'lucide-react';

interface GrievanceMapProps {
  complaints: Complaint[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  selectedId?: string;
  villageName?: string;
  showBoundary?: boolean;
  radiusMeters?: number;
  onLocationPicked?: (lat: number, lng: number) => void;
  isPickingLocation?: boolean;
}

// Helper to dynamically update map center and zoom when props change
const MapController: React.FC<{
  center: [number, number];
  zoom: number;
  onPick?: (lat: number, lng: number) => void;
  isPicking?: boolean;
}> = ({ center, zoom, onPick, isPicking }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [center, zoom, map]);

  useMapEvents({
    click(e) {
      if (isPicking && onPick) {
        onPick(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
};

// Custom Marker generator using Leaflet divIcon
const createCustomIcon = (status: string, priority: string) => {
  const isCritical = (priority || '').toUpperCase() === 'CRITICAL';
  const st = (status || '').toLowerCase();

  let color = '#f59e0b'; // Amber
  if (isCritical && st !== 'resolved') color = '#ef4444'; // Red
  else if (st === 'resolved') color = '#10b981'; // Green
  else if (st === 'in progress') color = '#06b6d4'; // Cyan
  else if (st === 'assigned') color = '#3b82f6'; // Blue

  const html = `
    <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${color}; opacity: 0.35; animation: ${
    isCritical ? 'civic-pulse 1.5s infinite' : 'none'
  };"></div>
      <div style="width: 18px; height: 18px; border-radius: 50%; background: ${color}; border: 2.5px solid #ffffff; box-shadow: 0 4px 8px -1px rgba(0,0,0,0.4);"></div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-map-pin',
    html,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export const GrievanceMap: React.FC<GrievanceMapProps> = ({
  complaints,
  center = [26.8485, 80.9482], // Default Rampur Panchayat Center
  zoom = 14,
  height = '550px',
  villageName = 'Rampur Gram Panchayat',
  showBoundary = true,
  radiusMeters = 2500,
  onLocationPicked,
  isPickingLocation = false,
}) => {
  const navigate = useNavigate();

  // Filter complaints that have valid coordinates
  const validMappableComplaints = useMemo(() => {
    return complaints.filter(
      (c) =>
        typeof c.latitude === 'number' &&
        typeof c.longitude === 'number' &&
        !isNaN(c.latitude) &&
        !isNaN(c.longitude)
    );
  }, [complaints]);

  return (
    <div
      style={{ height }}
      className={`w-full relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl transition-colors ${
        isPickingLocation ? 'cursor-crosshair ring-2 ring-emerald-500' : ''
      }`}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <MapController
          center={center}
          zoom={zoom}
          onPick={onLocationPicked}
          isPicking={isPickingLocation}
        />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Village Jurisdiction Boundary Circle */}
        {showBoundary && (
          <Circle
            center={center}
            radius={radiusMeters}
            pathOptions={{
              color: '#10b981',
              fillColor: '#10b981',
              fillOpacity: 0.08,
              weight: 2,
              dashArray: '6, 6',
            }}
          >
            <Popup>
              <div className="p-1 text-xs">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{villageName} Jurisdiction Boundary</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Radius: {(radiusMeters / 1000).toFixed(1)} km Panchayat Boundary
                </div>
              </div>
            </Popup>
          </Circle>
        )}

        {/* Complaint Markers */}
        {validMappableComplaints.map((item) => {
          const id = item.complaintId || item.id;
          const icon = createCustomIcon(item.status, item.priority);

          return (
            <Marker key={item.id} position={[item.latitude!, item.longitude!]} icon={icon}>
              <Popup>
                <div className="p-1 max-w-xs space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-1.5">
                    <span className="font-mono text-xs font-bold text-civic-700 dark:text-civic-400">{id}</span>
                    <PriorityBadge priority={item.priority} size="sm" />
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <StatusBadge status={item.status} size="sm" />
                    <CategoryBadge category={item.category} />
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1 pt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>
                      {item.village}, {item.ward}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/complaints/${item.id}`)}
                    className="w-full mt-2 py-1.5 px-3 bg-civic-700 dark:bg-civic-600 hover:bg-civic-600 dark:hover:bg-civic-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Grievance Dossier</span>
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Interactive Picker Banner if User is Selecting Location on Map */}
      {isPickingLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <MapPin className="w-4 h-4" />
          <span>Click anywhere on the map to set your Gram Panchayat Village Center!</span>
        </div>
      )}

      {/* Village Focus Badge */}
      <div className="absolute top-4 right-4 z-[400] bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs shadow-xl flex items-center gap-2">
        <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin-slow" />
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Jurisdiction Focus</div>
          <div className="font-bold text-slate-900 dark:text-white">{villageName}</div>
        </div>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs shadow-xl space-y-1.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pb-1 border-b border-slate-200 dark:border-slate-800">
          Grievance Severity Legend
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span className="text-slate-700 dark:text-slate-300">Critical / Urgent Alert</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="text-slate-700 dark:text-slate-300">Pending Review</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
          <span className="text-slate-700 dark:text-slate-300">Work In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-slate-700 dark:text-slate-300">Resolved & Remediated</span>
        </div>
      </div>
    </div>
  );
};
