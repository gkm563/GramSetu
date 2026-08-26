import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Complaint } from '../../types/complaint';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { useNavigate } from 'react-router-dom';
import { Eye, MapPin } from 'lucide-react';

interface GrievanceMapProps {
  complaints: Complaint[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  selectedId?: string;
}

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
    <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${color}; opacity: 0.3; animation: ${
    isCritical ? 'civic-pulse 1.5s infinite' : 'none'
  };"></div>
      <div style="width: 18px; height: 18px; border-radius: 50%; background: ${color}; border: 2.5px solid #0f172a; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5);"></div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-map-pin',
    html,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

export const GrievanceMap: React.FC<GrievanceMapProps> = ({
  complaints,
  center = [26.8467, 80.9462], // Default UP/India rural center
  zoom = 12,
  height = '550px',
  selectedId,
}) => {
  const navigate = useNavigate();

  // Filter complaints that have valid coordinates
  const validMappableComplaints = useMemo(() => {
    return complaints.filter(
      (c) => typeof c.latitude === 'number' && typeof c.longitude === 'number' && !isNaN(c.latitude) && !isNaN(c.longitude)
    );
  }, [complaints]);

  // Compute center from complaints if available
  const computedCenter = useMemo<[number, number]>(() => {
    if (validMappableComplaints.length > 0) {
      const avgLat =
        validMappableComplaints.reduce((acc, curr) => acc + (curr.latitude || 0), 0) /
        validMappableComplaints.length;
      const avgLng =
        validMappableComplaints.reduce((acc, curr) => acc + (curr.longitude || 0), 0) /
        validMappableComplaints.length;
      return [avgLat, avgLng];
    }
    return center;
  }, [validMappableComplaints, center]);

  return (
    <div style={{ height }} className="w-full relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <MapContainer
        center={computedCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validMappableComplaints.map((item) => {
          const id = item.complaintId || item.id;
          const icon = createCustomIcon(item.status, item.priority);

          return (
            <Marker key={item.id} position={[item.latitude!, item.longitude!]} icon={icon}>
              <Popup>
                <div className="p-1 max-w-xs space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5">
                    <span className="font-mono text-xs font-bold text-civic-400">{id}</span>
                    <PriorityBadge priority={item.priority} size="sm" />
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <StatusBadge status={item.status} size="sm" />
                    <CategoryBadge category={item.category} />
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>
                      {item.village}, {item.ward}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/complaints/${item.id}`)}
                    className="w-full mt-2 py-1.5 px-3 bg-civic-600 hover:bg-civic-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
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

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-xs shadow-xl space-y-1.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-800">
          Grievance Severity Legend
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span className="text-slate-300">Critical / Urgent Alert</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="text-slate-300">Pending Review</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
          <span className="text-slate-300">Work In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-slate-300">Resolved & Remediated</span>
        </div>
      </div>
    </div>
  );
};
