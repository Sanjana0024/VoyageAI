import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

function TravelMap({ places }) {

  const coordinates = {

    // Himachal
    "Manali":[32.2396,77.1887],
    "Solang Valley":[32.3186,77.1503],
    "Rohtang Pass":[32.3642,77.2493],
    "Old Manali":[32.2432,77.1892],
    "Hidimba Devi Temple":[32.2470,77.1793],
    "Vashisht Hot Springs":[32.2463,77.1875],

    // Assam
    "Kaziranga National Park":[26.5775,93.1711],
    "Kamakhya Temple":[26.1665,91.7050],
    "Brahmaputra River":[26.1445,91.7362],
    "Guwahati":[26.1445,91.7362],

    // Goa
    "Baga Beach":[15.5600,73.7517],
    "Calangute Beach":[15.5439,73.7553],

    // Jaipur
    "Hawa Mahal":[26.9239,75.8267],
    "Amber Fort":[26.9855,75.8513],

    // Delhi
    "India Gate":[28.6129,77.2295],
    "Red Fort":[28.6562,77.2410]
  };

  const firstPlace = places?.[0];

  const center =
    coordinates[firstPlace] || [20.5937,78.9629];

  return (

    <div className="mt-8">

      <h2 className="text-2xl font-bold mb-4">
        🗺 Travel Route
      </h2>

      <div className="rounded-3xl overflow-hidden shadow-xl border">

        <MapContainer

          center={center}

          zoom={10}

          scrollWheelZoom={true}

          style={{
            width: "100%",
            height: "450px"
          }}

        >

          <TileLayer
            attribution="OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {places?.map((place,index)=>{

            const position =
              coordinates[place];

            if(!position) return null;

            return(

              <Marker
                key={index}
                position={position}
              >

                <Popup>

                  <b>{place}</b>

                </Popup>

              </Marker>

            );

          })}

        </MapContainer>

      </div>

    </div>

  );

}

export default TravelMap;