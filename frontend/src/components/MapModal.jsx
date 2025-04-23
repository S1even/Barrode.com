import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import styled from 'styled-components';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correct icons Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const MapModal = ({ show, onClose, onAddPoint, gpsPoints, setGpsPoints }) => {
  const [markers, setMarkers] = useState(gpsPoints || []);


  const handleValidatePoints = () => {
    setGpsPoints(markers); 
    onClose();
  };

  const handleMapClick = (latlng) => {
    setMarkers((prev) => [...prev, latlng]);
    onAddPoint(latlng);
  };

  const handleResetPoints = () => {
    setMarkers([]);
    setGpsPoints([]);
  };

  if (!show) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <MapContainer center={[46.6, 2.2]} zoom={6} style={{ height: '300px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.fr/">OpenStreetMap France</a> contributors'
          />
          <MapClickHandler onMapClick={handleMapClick} />
          {markers.map((pos, idx) => (
            <Marker key={idx} position={pos} />
          ))}
          <Polyline positions={markers} color="blue" />
        </MapContainer>

        <div className="map-buttons">
          <button onClick={handleResetPoints}>Réinitialiser</button>
          <button onClick={onClose}>Fermer</button>
          <button onClick={handleValidatePoints}>Valider les points</button>

        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

export default MapModal;


// Styles pour la modale
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;
