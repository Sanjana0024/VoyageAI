import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView() {
  useEffect(() => {
    // create map only once
    const map = L.map("map").setView([28.6139, 77.2090], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    return () => {
      map.remove(); // cleanup
    };
  }, []);

  return <div id="map" className="map-container"></div>;
}