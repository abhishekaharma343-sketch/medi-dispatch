import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  MapPin,
  Ambulance as AmbulanceIcon,
  Navigation,
  Building2,
  Filter,
  Maximize2,
  RefreshCw,
  Zap,
  Clock,
  User,
} from 'lucide-react';
import { useDispatchContext } from '../../context/DispatchContext';
import { EmergencyRequest, Ambulance, Hospital } from '../../types/dispatch';

export const LiveMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routesLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const {
    ambulances,
    requests,
    hospitals,
    openDispatchModal,
    openTimelineModal,
    setActiveTab,
  } = useDispatchContext();

  const [showAmbulances, setShowAmbulances] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);

  // Selected marker for drawer details
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<EmergencyRequest | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center around Midtown Metro
    const map = L.map(mapContainerRef.current, {
      center: [40.758, -73.9855],
      zoom: 13,
      zoomControl: true,
      attributionControl: false,
    });

    // Dark styled tile layer via CartoDB or OpenStreetMap with CSS filter
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    const routesGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    routesLayerGroupRef.current = routesGroup;
    markersLayerGroupRef.current = markersGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers & Polylines whenever state changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    const routesGroup = routesLayerGroupRef.current;

    if (!map || !markersGroup || !routesGroup) return;

    markersGroup.clearLayers();
    routesGroup.clearLayers();

    // 1. Render Hospitals
    if (showHospitals) {
      hospitals.forEach((hosp) => {
        const iconHtml = `
          <div style="
            background: #064e3b;
            border: 2px solid #34d399;
            color: #ecfdf5;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          ">
            🏥
          </div>
        `;
        const marker = L.marker([hosp.latitude, hosp.longitude], {
          icon: L.divIcon({
            html: iconHtml,
            className: 'custom-hosp-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          }),
        });

        marker.bindPopup(`
          <div style="min-width: 190px; padding: 4px;">
            <div style="font-weight: bold; color: #fff; font-size: 13px;">${hosp.name}</div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">${hosp.address}</div>
            <div style="font-size: 11px; margin-top: 6px; display: flex; justify-content: space-between;">
              <span style="color: #34d399; font-weight: 600;">Status: ${hosp.erCapacity}</span>
              <span style="color: #cbd5e1; font-mono: true;">Beds: ${hosp.availableBeds}</span>
            </div>
          </div>
        `);
        markersGroup.addLayer(marker);
      });
    }

    // 2. Render Incidents
    if (showIncidents) {
      requests
        .filter((req) => req.status !== 'COMPLETED' && req.status !== 'CANCELLED')
        .forEach((req) => {
          let bgColor = '#ef4444';
          let pulseClass = 'pulse-red';
          let emoji = '🔴';

          if (req.priority === 'HIGH') {
            bgColor = '#f97316';
            pulseClass = 'pulse-orange';
            emoji = '🟠';
          } else if (req.priority === 'MEDIUM') {
            bgColor = '#eab308';
            pulseClass = '';
            emoji = '🟡';
          } else if (req.priority === 'LOW') {
            bgColor = '#10b981';
            pulseClass = '';
            emoji = '🟢';
          }

          const iconHtml = `
            <div class="${pulseClass}" style="
              background: ${bgColor};
              color: white;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 2px solid white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              font-weight: bold;
              box-shadow: 0 4px 12px rgba(0,0,0,0.6);
              cursor: pointer;
            ">
              ${emoji}
            </div>
          `;

          const marker = L.marker([req.latitude, req.longitude], {
            icon: L.divIcon({
              html: iconHtml,
              className: 'custom-incident-marker',
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            }),
          });

          marker.on('click', () => {
            setSelectedIncident(req);
            setSelectedAmbulance(null);
          });

          markersGroup.addLayer(marker);

          // Render Route lines to assigned ambulance if assigned
          if (showRoutes && req.assignedAmbulanceId) {
            const assignedAmb = ambulances.find((a) => a.id === req.assignedAmbulanceId);
            if (assignedAmb) {
              const polyline = L.polyline(
                [
                  [assignedAmb.latitude, assignedAmb.longitude],
                  [req.latitude, req.longitude],
                ],
                {
                  color: '#38bdf8',
                  weight: 3,
                  dashArray: '6, 8',
                  opacity: 0.85,
                }
              );
              routesGroup.addLayer(polyline);
            }
          }
        });
    }

    // 3. Render Ambulances
    if (showAmbulances) {
      ambulances.forEach((amb) => {
        let borderColor = '#10b981'; // green Available
        let pulseClass = 'pulse-green';
        let statusEmoji = '🟢';

        if (amb.status === 'ASSIGNED') {
          borderColor = '#eab308';
          pulseClass = '';
          statusEmoji = '🟡';
        } else if (amb.status === 'EN_ROUTE') {
          borderColor = '#3b82f6';
          pulseClass = 'pulse-blue';
          statusEmoji = '🔵';
        } else if (amb.status === 'AT_INCIDENT') {
          borderColor = '#f97316';
          pulseClass = 'pulse-orange';
          statusEmoji = '🟠';
        } else if (amb.status === 'TRANSPORTING') {
          borderColor = '#a855f7';
          pulseClass = '';
          statusEmoji = '🟣';
        } else if (amb.status === 'MAINTENANCE') {
          borderColor = '#64748b';
          pulseClass = '';
          statusEmoji = '⚫';
        }

        const iconHtml = `
          <div class="${pulseClass}" style="
            background: #0f172a;
            border: 2px solid ${borderColor};
            color: #f8fafc;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            box-shadow: 0 4px 14px rgba(0,0,0,0.7);
            cursor: pointer;
            position: relative;
          ">
            🚑
            <span style="
              position: absolute;
              bottom: -2px;
              right: -2px;
              font-size: 10px;
            ">${statusEmoji}</span>
          </div>
        `;

        const marker = L.marker([amb.latitude, amb.longitude], {
          icon: L.divIcon({
            html: iconHtml,
            className: 'custom-amb-marker',
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          }),
        });

        marker.on('click', () => {
          setSelectedAmbulance(amb);
          setSelectedIncident(null);
        });

        markersGroup.addLayer(marker);
      });
    }
  }, [ambulances, requests, hospitals, showAmbulances, showIncidents, showHospitals, showRoutes]);

  const fitBoundsAll = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setView([40.758, -73.9855], 13);
  };

  return (
    <div className="p-4 max-w-[1700px] mx-auto space-y-3">
      {/* Top Map Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide flex items-center space-x-2">
              <span>Tactical Live CAD Map</span>
              <span className="text-xs font-mono bg-blue-950/80 text-blue-400 border border-blue-800/50 px-2 py-0.5 rounded font-semibold">
                GPS Tracking Active
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Real-time geolocated ambulance positions, pending incidents, and hospital emergency triage
            </p>
          </div>
        </div>

        {/* Map Layer Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setShowAmbulances(!showAmbulances)}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center space-x-1.5 transition cursor-pointer font-medium ${
              showAmbulances
                ? 'bg-slate-800 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <span>🚑 Units</span>
          </button>

          <button
            onClick={() => setShowIncidents(!showIncidents)}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center space-x-1.5 transition cursor-pointer font-medium ${
              showIncidents
                ? 'bg-slate-800 text-red-300 border-red-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <span>🔴 Incidents</span>
          </button>

          <button
            onClick={() => setShowHospitals(!showHospitals)}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center space-x-1.5 transition cursor-pointer font-medium ${
              showHospitals
                ? 'bg-slate-800 text-teal-300 border-teal-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <span>🏥 Hospitals</span>
          </button>

          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center space-x-1.5 transition cursor-pointer font-medium ${
              showRoutes
                ? 'bg-slate-800 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <span>🛣️ Routes</span>
          </button>

          <button
            onClick={fitBoundsAll}
            title="Reset to Central View"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Map Container & Sidebar Drawer */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl h-[640px] flex">
        {/* Leaflet Map Div */}
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Map Legend Required by Prompt */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-950/90 backdrop-blur-md border border-slate-800/90 rounded-xl p-3 shadow-xl max-w-xs text-xs space-y-2 pointer-events-auto select-none">
          <div className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider pb-1 border-b border-slate-800">
            Map Legend
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-300 font-mono">
            <div className="flex items-center space-x-1.5">
              <span>🚑🟢</span>
              <span>Available Unit</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>🚑🔵</span>
              <span>En Route Unit</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>🚑🟠</span>
              <span>At Incident</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>🚑🟣</span>
              <span>Transporting</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>🔴</span>
              <span>Critical Inc.</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>🟠</span>
              <span>High Priority</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>🟡</span>
              <span>Medium Inc.</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>🏥</span>
              <span>Trauma ER</span>
            </div>
          </div>
        </div>

        {/* Floating Detail Drawer (When an Ambulance or Incident Marker is Clicked) */}
        {(selectedAmbulance || selectedIncident) && (
          <div className="absolute top-4 right-4 z-20 w-80 bg-slate-950/95 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-2xl space-y-3 animate-in fade-in slide-in-from-right-4 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between pb-2 border-b border-slate-800">
              {selectedAmbulance ? (
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-base font-extrabold text-white">
                      {selectedAmbulance.id}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                      {selectedAmbulance.type}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    Status: {selectedAmbulance.status}
                  </span>
                </div>
              ) : selectedIncident ? (
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-base font-extrabold text-white">
                      {selectedIncident.id}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40">
                      {selectedIncident.priority}
                    </span>
                  </div>
                  <span className="text-xs text-slate-200 font-semibold">
                    {selectedIncident.emergencyType}
                  </span>
                </div>
              ) : null}

              <button
                onClick={() => {
                  setSelectedAmbulance(null);
                  setSelectedIncident(null);
                }}
                className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Ambulance Details */}
            {selectedAmbulance && (
              <div className="space-y-2 text-xs">
                <div className="text-slate-300">
                  <strong className="text-slate-400">Driver:</strong> {selectedAmbulance.driverName}
                </div>
                <div className="text-slate-300">
                  <strong className="text-slate-400">Crew:</strong>{' '}
                  {selectedAmbulance.medicalCrew.join(', ')}
                </div>
                <div className="text-slate-300">
                  <strong className="text-slate-400">Location:</strong>{' '}
                  {selectedAmbulance.currentLocation}
                </div>
                <div className="text-slate-300">
                  <strong className="text-slate-400">Current Incident:</strong>{' '}
                  {selectedAmbulance.currentIncidentId || 'None (Standby)'}
                </div>
                <div className="text-slate-300">
                  <strong className="text-slate-400">Fuel:</strong> {selectedAmbulance.fuelLevel}%
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab('ambulances')}
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition"
                  >
                    Fleet Details
                  </button>
                </div>
              </div>
            )}

            {/* Incident Details */}
            {selectedIncident && (
              <div className="space-y-2 text-xs">
                <div className="text-slate-300">
                  <strong className="text-slate-400">Location:</strong> {selectedIncident.location}
                </div>
                <div className="text-slate-300">
                  <strong className="text-slate-400">Request Time:</strong>{' '}
                  {selectedIncident.requestTime}
                </div>
                <div className="text-slate-300">
                  <strong className="text-slate-400">Assigned Unit:</strong>{' '}
                  {selectedIncident.assignedAmbulanceId || 'Pending Assignment'}
                </div>
                <div className="text-slate-300">
                  <strong className="text-slate-400">Status:</strong> {selectedIncident.status}
                </div>
                {selectedIncident.notes && (
                  <p className="text-[11px] text-slate-400 italic">
                    "{selectedIncident.notes}"
                  </p>
                )}

                <div className="pt-2 border-t border-slate-800 flex items-center space-x-2">
                  {selectedIncident.status === 'PENDING' || selectedIncident.status === 'NEW' ? (
                    <button
                      onClick={() => {
                        openDispatchModal(selectedIncident);
                        setSelectedIncident(null);
                      }}
                      className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold cursor-pointer transition flex items-center justify-center space-x-1"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Dispatch Unit</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        openTimelineModal(selectedIncident);
                        setSelectedIncident(null);
                      }}
                      className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition"
                    >
                      Audit Incident Timeline
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
