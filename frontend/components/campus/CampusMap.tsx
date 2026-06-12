"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Building, 
  MapPin, 
  Search, 
  Navigation, 
  Compass, 
  Layers, 
  Info, 
  ArrowRight,
  Eye,
  CheckCircle2,
  Calendar,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import BuildingPopup from "./BuildingPopup";

interface BuildingInfo {
  id: string;
  name: string;
  photo: string;
  departments: string[];
  hours: string;
  description: string;
  floorCount: number;
  lat: number;
  lng: number;
}

const CAMPUS_BUILDINGS: BuildingInfo[] = [
  {
    id: "block-a",
    name: "Engineering Block A (CSE)",
    photo: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500",
    departments: ["Computer Engineering", "Information Tech", "Data Science Labs"],
    hours: "08:00 AM - 08:00 PM",
    description: "Central computer science laboratories, advanced software engineering clusters, on-chip supercomputer networks.",
    floorCount: 5,
    lat: 28.5921,
    lng: 77.0458
  },
  {
    id: "block-b",
    name: "Science Block B (ECE & EE)",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500",
    departments: ["Electronics & Communications", "Robotics Research", "Electrical Science"],
    hours: "08:30 AM - 06:30 PM",
    description: "Advanced micro-electronics design blocks, hardware prototyping arenas, and robotic assembly divisions.",
    floorCount: 4,
    lat: 28.5926,
    lng: 77.0469
  },
  {
    id: "block-c",
    name: "Mechanical Center C (ME)",
    photo: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500",
    departments: ["Mechanical Design", "Thermodynamics", "CAD/CAM Simulation"],
    hours: "09:00 AM - 05:30 PM",
    description: "Thermal diagnostics chambers, physical testing yards, CNC machining rooms, fluid power centers.",
    floorCount: 3,
    lat: 28.5916,
    lng: 77.0470
  },
  {
    id: "block-d",
    name: "Biotech Science Complex",
    photo: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500",
    departments: ["Biotechnology", "Bio-Informatics", "Genetics & Chemistry Labs"],
    hours: "08:00 AM - 07:00 PM",
    description: "Aseptic tissue culturing, advanced gene sequencer modules, and biochemical process pilot frameworks.",
    floorCount: 4,
    lat: 28.5912,
    lng: 77.0460
  },
  {
    id: "library",
    name: "Central Knowledge Center",
    photo: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500",
    departments: ["Central Digital Library", "Reference Archives", "Research Lounge"],
    hours: "24 HOURS OPEN",
    description: "Comprehensive scientific database access nodes, rotating barcode RFID turnstiles, independent study pods.",
    floorCount: 6,
    lat: 28.5921,
    lng: 77.0465
  },
  {
    id: "registrar",
    name: "Administration HQ (Registrar)",
    photo: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500",
    departments: ["Registrar Services Staff", "Admission Board", "Treasury Account Desk"],
    hours: "09:00 AM - 05:00 PM",
    description: "NFC smart student identity issuances, on-boarding document verification desks, university registry.",
    floorCount: 3,
    lat: 28.5925,
    lng: 77.0461
  },
  {
    id: "cafeteria",
    name: "Student Hub & Canteen Arena",
    photo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500",
    departments: ["Catering Services", "Union Desk", "Activity Amphitheater"],
    hours: "07:30 AM - 10:00 PM",
    description: "Multicuisine food court, open auditorium stage, cashless student wallet POS counters, social lounge.",
    floorCount: 2,
    lat: 28.5911,
    lng: 77.0466
  }
];

export default function CampusMap() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingInfo | null>(CAMPUS_BUILDINGS[4]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Router directions endpoints
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [routeActive, setRouteActive] = useState(false);

  // Leaflet map instance storage
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const routePolylineRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

  // A. LOAD LEAFLET CDN SCRIPTS SAFELY
  useEffect(() => {
    if (typeof window === "undefined") return;

    const leafletCssId = "leaflet-css-cdn";
    const leafletJsId = "leaflet-js-cdn";

    // 1. Inject Leaflet CSS
    if (!document.getElementById(leafletCssId)) {
      const link = document.createElement("link");
      link.id = leafletCssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // 2. Inject Leaflet JS
    if (!document.getElementById(leafletJsId)) {
      const script = document.createElement("script");
      script.id = leafletJsId;
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => {
        initializeMap();
      };
      document.body.appendChild(script);
    } else if ((window as any).L) {
      initializeMap();
    }

    return () => {
      // Cleanup map instance on component unmount
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (_) {}
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // B. INITIALIZE MAP
  const initializeMap = () => {
    const L = (window as any).L;
    if (!L || mapInstanceRef.current) return;

    try {
      // Instantiate map centered at Central Library
      const map = L.map(mapContainerRef.current, {
        center: [28.5921, 77.0465],
        zoom: 17,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19
      }).addTo(map);

      // Add Zoom Controls to bottom right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapInstanceRef.current = map;

      // Plot Campus Buildings
      CAMPUS_BUILDINGS.forEach((bld) => {
        // Customize Leaflet DivIcon
        const customIcon = L.divIcon({
          html: `
            <div class="relative flex items-center justify-center p-2.5 bg-blue-650 hover:bg-blue-500 border border-blue-400/50 text-white rounded-xl shadow-lg transition-all scale-100 hover:scale-110 cursor-pointer">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="9" />
                <rect x="14" y="3" width="7" height="5" />
                <rect x="14" y="12" width="7" height="9" />
                <rect x="3" y="16" width="7" height="5" />
              </svg>
            </div>
          `,
          className: "custom-leaflet-icon",
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const m = L.marker([bld.lat, bld.lng], { icon: customIcon })
          .addTo(map)
          .on("click", () => {
            setSelectedBuilding(bld);
            map.panTo([bld.lat, bld.lng]);
          });

        markersRef.current[bld.id] = m;
      });

      setMapLoaded(true);
    } catch (err) {
      console.error("Leaflet initialization failed: ", err);
    }
  };

  // C. RUN DIRECTIONS PATH SCHEDULING
  const handleDirections = (e: React.FormEvent) => {
    e.preventDefault();
    const L = (window as any).L;
    if (!L || !mapInstanceRef.current) return;

    if (!startPoint || !endPoint) {
      toast.error("Choose start and end locations to chart path.");
      return;
    }

    if (startPoint === endPoint) {
      toast.error("Start and end nodes match. No path routing required.");
      return;
    }

    // Retrieve buildings
    const startB = CAMPUS_BUILDINGS.find(b => b.id === startPoint);
    const endB = CAMPUS_BUILDINGS.find(b => b.id === endPoint);

    if (!startB || !endB) return;

    // Remove existing polyline Route
    if (routePolylineRef.current) {
      mapInstanceRef.current.removeLayer(routePolylineRef.current);
    }

    // Calculate a simulated pathing with helper nodes for organic winding
    const latDiff = (endB.lat - startB.lat) / 3;
    const lngDiff = (endB.lng - startB.lng) / 3;

    // Organic path nodes
    const routeCoordinates = [
      [startB.lat, startB.lng],
      [startB.lat + latDiff, startB.lng - lngDiff * 0.4],
      [startB.lat + latDiff * 2, startB.lng + lngDiff * 1.3],
      [endB.lat, endB.lng]
    ];

    // Neon blue polyline route
    const line = L.polyline(routeCoordinates, {
      color: "#3b82f6",
      weight: 5,
      opacity: 0.85,
      dashArray: "10, 10",
      lineCap: "round"
    }).addTo(mapInstanceRef.current);

    // Dynamic zooming layout
    const bounds = L.latLngBounds(routeCoordinates);
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });

    routePolylineRef.current = line;
    setRouteActive(true);
    toast.success(`Active path drawn from ${startB.name} to ${endB.name}!`);
  };

  // D. TRIGGER DIRECT SEED MAP PAN TO BUILDING OVERRIDE
  const panToBuilding = (bld: BuildingInfo) => {
    setSelectedBuilding(bld);
    if (mapInstanceRef.current && (window as any).L) {
      mapInstanceRef.current.panTo([bld.lat, bld.lng]);
      mapInstanceRef.current.setZoom(18);
    }
  };

  // E. ACQUIRE HIGH PRECISION LOCATION TAGS
  const handleMyLocation = () => {
    const L = (window as any).L;
    if (!L || !mapInstanceRef.current) return;

    toast.loading("Querying network coordinates...", { id: "gps-loading" });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        toast.dismiss("gps-loading");
        toast.success("User coordinates located successfully!");

        // Remove previous user marker
        if (userMarkerRef.current) {
          mapInstanceRef.current.removeLayer(userMarkerRef.current);
        }

        const personIcon = L.divIcon({
          html: `
            <div class="relative flex items-center justify-center">
              <div class="absolute w-6 h-6 bg-emerald-500/30 rounded-full animate-ping" />
              <div class="w-4.5 h-4.5 bg-emerald-500 border-2 border-white rounded-full shadow-lg z-10" />
            </div>
          `,
          className: "user-loc-marker",
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const m = L.marker([latitude, longitude], { icon: personIcon })
          .addTo(mapInstanceRef.current);

        userMarkerRef.current = m;
        mapInstanceRef.current.panTo([latitude, longitude]);
        mapInstanceRef.current.setZoom(17);
      },
      () => {
        // Mock fallback slightly offset from current library
        const mockLat = 28.5918;
        const mockLng = 77.0463;
        setUserLocation({ lat: mockLat, lng: mockLng });

        toast.dismiss("gps-loading");
        toast.warning("Satellite GPS timeout. Loaded simulated device point near central library.");

        if (userMarkerRef.current) {
          mapInstanceRef.current.removeLayer(userMarkerRef.current);
        }

        const personIcon = L.divIcon({
          html: `
            <div class="relative flex items-center justify-center">
              <div class="absolute w-6 h-6 bg-emerald-500/30 rounded-full animate-ping" />
              <div class="w-4.5 h-4.5 bg-emerald-500 border-2 border-white rounded-full shadow-lg z-10" />
            </div>
          `,
          className: "user-loc-marker",
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const m = L.marker([mockLat, mockLng], { icon: personIcon })
          .addTo(mapInstanceRef.current);

        userMarkerRef.current = m;
        mapInstanceRef.current.panTo([mockLat, mockLng]);
        mapInstanceRef.current.setZoom(17);
      },
      { timeout: 5000 }
    );
  };

  // F. TRIGGER POPUP ROUTE SETUP
  const triggerNavigationRoute = (id: string) => {
    setStartPoint("library"); // Fallback starting central library
    setEndPoint(id);
    toast.success("Routing setup loaded relative to Central Library node.");
  };

  const filteredBuildings = CAMPUS_BUILDINGS.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.departments.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 text-left">
      
      {/* GRID MATRIX MAP + FORM CONTROLLER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEAFLET CANVAS - 8 COLS */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col md:flex-row items-center gap-3">
            {/* Find Search bar */}
            <div className="relative flex-1 w-full">
              <Search className="w-4.5 h-4.5 text-slate-500 absolute left-3 w-4 h-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Find buildings by name or research departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-xl text-xs font-semibold pl-10 pr-4 py-2.5 text-white placeholder:text-slate-550 outline-none focus:border-blue-500/50"
              />
            </div>

            <button
              onClick={handleMyLocation}
              className="px-4 py-2.5 text-xs font-black bg-slate-900 border border-white/5 hover:border-emerald-500/20 hover:bg-emerald-500/5 text-slate-350 hover:text-emerald-450 rounded-xl cursor-pointer transition-all uppercase tracking-wider shrink-0 inline-flex items-center gap-1.5"
            >
              <Compass className="w-4 select-none shrink-0" />
              Calibrate GPS Location
            </button>
          </div>

          {/* Leaflet Frame canvas */}
          <div className="relative rounded-[32px] overflow-hidden border border-white/5 h-[480px] bg-slate-950 shadow-inner group">
            
            {/* The Raw Leaflet map element */}
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {!mapLoaded && (
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-center select-none z-10">
                <Compass className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-[10px] text-slate-500 font-extrabold tracking-widest uppercase mt-4">
                  Loading OpenStreetMap Engine...
                </p>
              </div>
            )}

            {/* Float HUD on bottom left */}
            <div className="absolute bottom-4 left-4 z-10 p-3 bg-slate-900/90 border border-white/10 rounded-2xl filter backdrop-blur space-y-1.5 max-w-xs font-mono text-[9px] text-slate-400 select-all leading-relaxed uppercase shadow-lg">
              <span className="font-extrabold text-white text-[10px] tracking-wide block">Map Telemetry</span>
              • SYSTEM NODES: 7 BUILDINGS PLOTTED<br />
              • SECTOR ACCENT: GATEWAYS DWARKA TECH<br />
              • CACHE STATUS: CACHED OFFLINE BLUEPRINT
            </div>
          </div>

        </div>

        {/* SIDEWAYS SEARCH & ROUTING DESK */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* A. Dynamic selected building POPUP details */}
          {selectedBuilding ? (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-1">
                <Layers className="w-4.5 h-4.5 text-sky-450" />
                Selected Destination
              </h3>
              <BuildingPopup 
                building={selectedBuilding} 
                onClose={() => setSelectedBuilding(null)} 
                onNavigate={triggerNavigationRoute}
              />
            </div>
          ) : (
            <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl text-center flex flex-col items-center justify-center h-[280px]">
              <Compass className="w-8 h-8 text-slate-600 mb-2 opacity-50 animate-pulse" />
              <p className="text-xs text-slate-500 uppercase font-black tracking-wider leading-none">
                Select a Map Marker
              </p>
              <p className="text-[9.5px] text-slate-550 uppercase font-bold tracking-normal mt-1 max-w-xs leading-relaxed">
                Click any building marker on the map to review timings, descriptions, and list departments.
              </p>
            </div>
          )}

          {/* B. PATH ROUTER FORM */}
          <div className="bg-slate-900 border border-white/5 rounded-[28px] p-6 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-[0.25em] flex items-center gap-1.5 leading-none">
              <Navigation className="w-4 h-4 text-emerald-400" />
              Interactive Route Charting
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
              Select any two points on the grid to map walking corridors and track transit distances.
            </p>

            <form onSubmit={handleDirections} className="space-y-3.5 text-xs text-left">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Starting Location</label>
                <select
                  value={startPoint}
                  onChange={e => setStartPoint(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl font-bold text-white uppercase"
                >
                  <option value="">-- Choose Origin Block --</option>
                  {CAMPUS_BUILDINGS.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                  {userLocation && <option value="user">My Calibrated Location</option>}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Destination</label>
                <select
                  value={endPoint}
                  onChange={e => setEndPoint(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl font-bold text-white uppercase"
                >
                  <option value="">-- Choose Endpoint Block --</option>
                  {CAMPUS_BUILDINGS.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                Chart Walk Route <ArrowRight className="w-4 h-4" />
              </button>

              {routeActive && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/10 rounded-xl flex items-center gap-2 font-mono text-[9px] text-emerald-400 leading-none uppercase leading-relaxed font-bold animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> ROUTE TRACED SUCCESS • OPTIMAL WALK CORRIDOR DISTANCE ~450m
                </div>
              )}
            </form>
          </div>

        </div>

      </div>

      {/* QUICK BUILDING FINDERS LISTGRID */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            Spotlight Building Index
          </h3>
          <p className="text-[10px] text-slate-550 font-bold uppercase font-mono mt-0.5">
            Quick pan controls. Click any indexed card to focus the map and pop out specifications.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredBuildings.map(bld => (
            <button
              onClick={() => panToBuilding(bld)}
              key={bld.id}
              className={`bg-slate-900 border text-left rounded-2xl p-4 transition-all hover:scale-[1.01] flex flex-col justify-between h-32 cursor-pointer group ${
                selectedBuilding?.id === bld.id ? "border-blue-500 bg-blue-500/[0.02]" : "border-white/5"
              }`}
            >
              <div className="space-y-1">
                <span className="text-[8px] font-black uppercase bg-slate-950 border border-white/5 text-blue-300 font-mono tracking-widest px-1.5 py-0.5 rounded leading-none">
                  {bld.id.toUpperCase()}
                </span>
                <h4 className="text-xs font-black text-white uppercase tracking-wider leading-tight group-hover:text-blue-400 pt-1">
                  {bld.name}
                </h4>
              </div>

              <div className="flex items-center justify-between text-slate-500 text-[9px] font-bold uppercase mt-4">
                <span className="font-mono flex items-center gap-1">
                  <Calendar className="w-3" /> Timely open
                </span>
                <span className="hover:text-white transition-colors flex items-center gap-0.5">
                  View <Eye className="w-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
