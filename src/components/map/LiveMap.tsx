import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Ambulance as AmbulanceIcon,
  Building2,
  Maximize2,
  RefreshCw,
  Zap,
  Navigation,
  X,
  Activity,
  Route,
  CircleDot,
} from 'lucide-react';
import { useDispatchContext } from '../../context/DispatchContext';
import {
  EmergencyRequest,
  Ambulance,
} from '../../types/dispatch';

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

  const [selectedAmbulance, setSelectedAmbulance] =
    useState<Ambulance | null>(null);

  const [selectedIncident, setSelectedIncident] =
    useState<EmergencyRequest | null>(null);

  const activeIncidents = requests.filter(
    (req) =>
      req.status !== 'COMPLETED' &&
      req.status !== 'CANCELLED'
  );

  const availableAmbulances = ambulances.filter(
    (amb) => amb.status === 'AVAILABLE'
  );

  const activeAmbulances = ambulances.filter(
    (amb) =>
      amb.status === 'ASSIGNED' ||
      amb.status === 'EN_ROUTE' ||
      amb.status === 'AT_INCIDENT' ||
      amb.status === 'TRANSPORTING'
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [22.9734, 78.6569],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        subdomains: 'abcd',
      }
    ).addTo(map);

    L.control
      .zoom({
        position: 'bottomright',
      })
      .addTo(map);

    const routesGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    routesLayerGroupRef.current = routesGroup;
    markersLayerGroupRef.current = markersGroup;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerGroupRef.current = null;
      routesLayerGroupRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    const routesGroup = routesLayerGroupRef.current;

    if (!map || !markersGroup || !routesGroup) return;

    markersGroup.clearLayers();
    routesGroup.clearLayers();

    if (showHospitals) {
      hospitals.forEach((hospital) => {
        const iconHtml = `
          <div style="
            width:34px;
            height:34px;
            border-radius:10px;
            background:#0f172a;
            border:2px solid #14b8a6;
            display:flex;
            align-items:center;
            justify-content:center;
            box-shadow:0 5px 18px rgba(0,0,0,.65);
            font-size:17px;
          ">
            🏥
          </div>
        `;

        const marker = L.marker(
          [hospital.latitude, hospital.longitude],
          {
            icon: L.divIcon({
              html: iconHtml,
              className: 'medi-hospital-marker',
              iconSize: [34, 34],
              iconAnchor: [17, 17],
            }),
          }
        );

        marker.bindPopup(`
          <div style="
            min-width:210px;
            background:#020617;
            color:#e2e8f0;
            padding:10px;
            border-radius:10px;
          ">
            <div style="
              font-weight:700;
              font-size:13px;
              margin-bottom:5px;
            ">
              ${hospital.name}
            </div>

            <div style="
              color:#94a3b8;
              font-size:11px;
              line-height:1.5;
            ">
              ${hospital.address}
            </div>

            <div style="
              display:flex;
              justify-content:space-between;
              margin-top:8px;
              font-size:11px;
            ">
              <span style="color:#2dd4bf">
                ER: ${hospital.erCapacity}
              </span>

              <span style="color:#cbd5e1">
                Beds: ${hospital.availableBeds}
              </span>
            </div>
          </div>
        `);

        markersGroup.addLayer(marker);
      });
    }

    if (showIncidents) {
      activeIncidents.forEach((incident) => {
        let bgColor = '#ef4444';
        let emoji = '🔴';

        if (incident.priority === 'HIGH') {
          bgColor = '#f97316';
          emoji = '🟠';
        } else if (incident.priority === 'MEDIUM') {
          bgColor = '#eab308';
          emoji = '🟡';
        } else if (incident.priority === 'LOW') {
          bgColor = '#10b981';
          emoji = '🟢';
        }

        const iconHtml = `
          <div style="
            width:34px;
            height:34px;
            border-radius:50%;
            background:${bgColor};
            border:2px solid rgba(255,255,255,.9);
            display:flex;
            align-items:center;
            justify-content:center;
            box-shadow:0 4px 16px rgba(0,0,0,.7);
            font-size:14px;
            cursor:pointer;
          ">
            ${emoji}
          </div>
        `;

        const marker = L.marker(
          [incident.latitude, incident.longitude],
          {
            icon: L.divIcon({
              html: iconHtml,
              className: 'medi-incident-marker',
              iconSize: [34, 34],
              iconAnchor: [17, 17],
            }),
          }
        );

        marker.on('click', () => {
          setSelectedIncident(incident);
          setSelectedAmbulance(null);
        });

        markersGroup.addLayer(marker);

        if (showRoutes && incident.assignedAmbulanceId) {
          const assignedAmbulance = ambulances.find(
            (amb) =>
              amb.id === incident.assignedAmbulanceId
          );

          if (assignedAmbulance) {
            const route = L.polyline(
              [
                [
                  assignedAmbulance.latitude,
                  assignedAmbulance.longitude,
                ],
                [
                  incident.latitude,
                  incident.longitude,
                ],
              ],
              {
                color: '#38bdf8',
                weight: 3,
                dashArray: '7, 8',
                opacity: 0.8,
              }
            );

            routesGroup.addLayer(route);
          }
        }
      });
    }

    if (showAmbulances) {
      ambulances.forEach((ambulance) => {
        let borderColor = '#10b981';
        let statusIcon = '🟢';

        if (ambulance.status === 'ASSIGNED') {
          borderColor = '#eab308';
          statusIcon = '🟡';
        } else if (ambulance.status === 'EN_ROUTE') {
          borderColor = '#3b82f6';
          statusIcon = '🔵';
        } else if (ambulance.status === 'AT_INCIDENT') {
          borderColor = '#f97316';
          statusIcon = '🟠';
        } else if (ambulance.status === 'TRANSPORTING') {
          borderColor = '#a855f7';
          statusIcon = '🟣';
        } else if (ambulance.status === 'MAINTENANCE') {
          borderColor = '#64748b';
          statusIcon = '⚫';
        }

        const iconHtml = `
          <div style="
            width:40px;
            height:40px;
            border-radius:50%;
            background:#020617;
            border:2px solid ${borderColor};
            display:flex;
            align-items:center;
            justify-content:center;
            box-shadow:0 5px 20px rgba(0,0,0,.75);
            font-size:18px;
            cursor:pointer;
            position:relative;
          ">
            🚑

            <span style="
              position:absolute;
              right:-3px;
              bottom:-3px;
              font-size:10px;
            ">
              ${statusIcon}
            </span>
          </div>
        `;

        const marker = L.marker(
          [ambulance.latitude, ambulance.longitude],
          {
            icon: L.divIcon({
              html: iconHtml,
              className: 'medi-ambulance-marker',
              iconSize: [40, 40],
              iconAnchor: [20, 20],
            }),
          }
        );

        marker.on('click', () => {
          setSelectedAmbulance(ambulance);
          setSelectedIncident(null);
        });

        markersGroup.addLayer(marker);
      });
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [
    ambulances,
    requests,
    hospitals,
    showAmbulances,
    showIncidents,
    showHospitals,
    showRoutes,
  ]);

  const resetMap = () => {
    const map = mapInstanceRef.current;

    if (!map) return;

    map.setView([22.9734, 78.6569], 5);

    setSelectedAmbulance(null);
    setSelectedIncident(null);
  };

  const focusOnAmbulance = (ambulance: Ambulance) => {
    const map = mapInstanceRef.current;

    if (!map) return;

    map.setView(
      [ambulance.latitude, ambulance.longitude],
      15,
      {
        animate: true,
      }
    );

    setSelectedAmbulance(ambulance);
    setSelectedIncident(null);
  };

  const focusOnIncident = (incident: EmergencyRequest) => {
    const map = mapInstanceRef.current;

    if (!map) return;

    map.setView(
      [incident.latitude, incident.longitude],
      15,
      {
        animate: true,
      }
    );

    setSelectedIncident(incident);
    setSelectedAmbulance(null);
  };

  return (
    <div className="p-3 sm:p-4 max-w-[1700px] mx-auto space-y-3">
      {/* HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-white">
                  Live Map
                </h1>

                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  GPS LIVE
                </span>
              </div>

              <p className="text-[11px] text-slate-500 mt-0.5">
                Real-time ambulance, incident and hospital tracking
              </p>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="grid grid-cols-3 gap-2">
            <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 min-w-[90px]">
              <p className="text-[9px] uppercase tracking-wider text-slate-600">
                Incidents
              </p>
              <p className="text-sm font-bold text-red-400 mt-0.5">
                {activeIncidents.length}
              </p>
            </div>

            <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 min-w-[90px]">
              <p className="text-[9px] uppercase tracking-wider text-slate-600">
                Available
              </p>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">
                {availableAmbulances.length}
              </p>
            </div>

            <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 min-w-[90px]">
              <p className="text-[9px] uppercase tracking-wider text-slate-600">
                On Mission
              </p>
              <p className="text-sm font-bold text-blue-400 mt-0.5">
                {activeAmbulances.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden lg:flex items-center gap-1.5 px-2 text-[10px] uppercase tracking-wider text-slate-600 font-semibold">
            <Activity className="w-3.5 h-3.5" />
            Layers
          </span>

          <button
            onClick={() =>
              setShowAmbulances(!showAmbulances)
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition ${
              showAmbulances
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <AmbulanceIcon className="w-3.5 h-3.5" />
            Ambulances
          </button>

          <button
            onClick={() =>
              setShowIncidents(!showIncidents)
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition ${
              showIncidents
                ? 'bg-red-500/10 border-red-500/30 text-red-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <CircleDot className="w-3.5 h-3.5" />
            Incidents
          </button>

          <button
            onClick={() =>
              setShowHospitals(!showHospitals)
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition ${
              showHospitals
                ? 'bg-teal-500/10 border-teal-500/30 text-teal-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Hospitals
          </button>

          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition ${
              showRoutes
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            Routes
          </button>

          <div className="flex-1" />

          <button
            onClick={resetMap}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-[11px] font-semibold transition"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Reset View
          </button>

          <button
            onClick={() => {
              const map = mapInstanceRef.current;
              if (map) map.invalidateSize();
            }}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition"
            title="Refresh map"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* MAP */}
      <div className="relative h-[560px] sm:h-[640px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
        <div
          ref={mapContainerRef}
          className="w-full h-full"
        />

        {/* TOP LEFT STATUS */}
        <div className="absolute top-3 left-3 z-[500] bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-2 shadow-xl">
          <div className="flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-semibold text-slate-300">
              NATIONAL RESPONSE VIEW
            </span>
          </div>

          <p className="text-[9px] text-slate-600 mt-1">
            Live operational tracking
          </p>
        </div>

        {/* LEGEND */}
        <div className="absolute bottom-4 left-3 z-[500] bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-xl">
          <p className="text-[9px] uppercase tracking-widest font-bold text-slate-500 mb-2">
            Map Legend
          </p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] text-slate-400">
            <span>🚑 🟢 Available</span>
            <span>🚑 🔵 En Route</span>
            <span>🚑 🟠 Incident</span>
            <span>🚑 🟣 Transport</span>
            <span>🔴 Critical</span>
            <span>🟠 High</span>
            <span>🟡 Medium</span>
            <span>🏥 Hospital</span>
          </div>
        </div>

        {/* SELECTED DRAWER */}
        {(selectedAmbulance || selectedIncident) && (
          <div className="absolute top-3 right-3 z-[500] w-[min(340px,calc(100%-24px))] bg-slate-950/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-start justify-between gap-3">
              {selectedAmbulance ? (
                <div>
                  <div className="flex items-center gap-2">
                    <AmbulanceIcon className="w-4 h-4 text-emerald-400" />

                    <span className="font-mono font-bold text-white">
                      {selectedAmbulance.id}
                    </span>

                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {selectedAmbulance.type}
                    </span>
                  </div>

                  <p className="text-[10px] text-emerald-400 mt-1 font-semibold">
                    {selectedAmbulance.status}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-red-400" />

                    <span className="font-mono font-bold text-white">
                      {selectedIncident?.id}
                    </span>

                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-300">
                      {selectedIncident?.priority}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-1">
                    {selectedIncident?.emergencyType}
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  setSelectedAmbulance(null);
                  setSelectedIncident(null);
                }}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-white transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {selectedAmbulance && (
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5">
                    <p className="text-[9px] text-slate-600 uppercase">
                      Driver
                    </p>
                    <p className="text-[11px] text-slate-300 font-semibold mt-1 truncate">
                      {selectedAmbulance.driverName}
                    </p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5">
                    <p className="text-[9px] text-slate-600 uppercase">
                      Fuel
                    </p>
                    <p className="text-[11px] text-slate-300 font-semibold mt-1">
                      {selectedAmbulance.fuelLevel}%
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[9px] text-slate-600 uppercase">
                    Current Location
                  </p>

                  <p className="text-[11px] text-slate-300 mt-1">
                    {selectedAmbulance.currentLocation}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] text-slate-600 uppercase">
                    Current Incident
                  </p>

                  <p className="text-[11px] text-blue-300 font-mono mt-1">
                    {selectedAmbulance.currentIncidentId ||
                      'No active incident'}
                  </p>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() =>
                      focusOnAmbulance(selectedAmbulance)
                    }
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition"
                  >
                    <Navigation className="w-3 h-3" />
                    Track Unit
                  </button>

                  <button
                    onClick={() =>
                      setActiveTab('ambulances')
                    }
                    className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition"
                  >
                    Fleet Details
                  </button>
                </div>
              </div>
            )}

            {selectedIncident && (
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-[9px] text-slate-600 uppercase">
                    Location
                  </p>

                  <p className="text-[11px] text-slate-300 mt-1">
                    {selectedIncident.location}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5">
                    <p className="text-[9px] text-slate-600 uppercase">
                      Status
                    </p>

                    <p className="text-[10px] text-slate-300 font-semibold mt-1">
                      {selectedIncident.status}
                    </p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5">
                    <p className="text-[9px] text-slate-600 uppercase">
                      Assigned
                    </p>

                    <p className="text-[10px] text-blue-300 font-mono mt-1">
                      {selectedIncident.assignedAmbulanceId ||
                        'Pending'}
                    </p>
                  </div>
                </div>

                {selectedIncident.notes && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5">
                    <p className="text-[9px] text-slate-600 uppercase">
                      Notes
                    </p>

                    <p className="text-[10px] text-slate-400 mt-1 leading-4">
                      {selectedIncident.notes}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() =>
                      focusOnIncident(selectedIncident)
                    }
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition"
                  >
                    <Navigation className="w-3 h-3" />
                    Locate
                  </button>

                  {selectedIncident.status === 'PENDING' ||
                  selectedIncident.status === 'NEW' ? (
                    <button
                      onClick={() => {
                        openDispatchModal(selectedIncident);
                        setSelectedIncident(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold transition"
                    >
                      <Zap className="w-3 h-3" />
                      Dispatch
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        openTimelineModal(selectedIncident);
                        setSelectedIncident(null);
                      }}
                      className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition"
                    >
                      Timeline
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MOBILE QUICK ACCESS */}
      <div className="grid grid-cols-2 gap-2 sm:hidden">
        <button
          onClick={() => setActiveTab('ambulances')}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300"
        >
          <AmbulanceIcon className="w-4 h-4 text-emerald-400" />
          Fleet
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300"
        >
          <Zap className="w-4 h-4 text-red-400" />
          Requests
        </button>
      </div>
    </div>
  );
};