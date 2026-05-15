import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { pinColor } from './MapPin';

const iconFor = (severity) => L.divIcon({
  className: '',
  html: `<span style="display:block;width:16px;height:16px;border-radius:999px;background:${pinColor(severity)};border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,.25)"></span>`
});

export const IncidentMap = ({ incidents }) => {
  const withCoords = incidents.filter((item) => item.location?.lat && item.location?.lng);
  const center = withCoords[0] ? [withCoords[0].location.lat, withCoords[0].location.lng] : [12.9716, 77.5946];
  return (
    <div className="h-80 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <MapContainer center={center} zoom={12} className="h-full w-full">
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {withCoords.map((incident) => (
          <Marker key={incident._id} position={[incident.location.lat, incident.location.lng]} icon={iconFor(incident.aiAnalysis?.severity)}>
            <Popup>{incident.animalType} · {incident.status}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
