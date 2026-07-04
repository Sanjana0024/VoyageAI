import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix marker icon issue
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

function TravelMap({ places }) {

  // Default center (Manali)
  const center = [32.2396, 77.1887];

  // Simple mock coordinates (we'll improve later with AI)
  const coordinates = {
    "Manali": [32.2396, 77.1887],
    "Solang Valley": [32.3186, 77.1503],
    "Rohtang Pass": [32.3642, 77.2493],
    "Old Manali": [32.2432, 77.1892],
    "Vashisht Hot Springs": [32.2463, 77.1875],
    "Hidimba Devi Temple": [32.2470, 77.1793]
  };

  return (
    <div className="mt-8 rounded-2xl overflow-hidden shadow-xl">

      <h3 className="text-xl font-bold mb-3">
        📍 Your Travel Map
      </h3>

      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "400px", width: "100%" }}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {places?.map((place, index) => (
          <Marker
            key={index}
            position={coordinates[place] || center}
          >
            <Popup>
              <b>{place}</b>
            </Popup>
          </Marker>
        ))}

      </MapContainer>

    </div>
  );
}

export default TravelMap;