import React from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";

const MapViewer = ({ path, onClose }) => {
  if (!path || path.length === 0) return null;

  return (
    <Overlay>
      <div className="map-wrapper">
        <button className="close" onClick={onClose}>X</button>
        <MapContainer center={path[0]} zoom={13} scrollWheelZoom={false} style={{ height: "300px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
          />
          <Polyline positions={path} color="blue" />
        </MapContainer>
      </div>
    </Overlay>
  );
};

export default MapViewer;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;

  .map-wrapper {
    background: white;
    padding: 1rem;
    border-radius: 12px;
    position: relative;
    width: 90%;
    max-width: 600px;
  }

  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #ff5e5e;
    color: white;
    border: none;
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    cursor: pointer;
  }
`;
